import { useState } from 'react'
import { useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  AppButton,
  AppHeader,
  AppInput,
  AppText,
  Screen,
  SegmentedControl,
  SelectField,
  TextButton,
} from '@/components'
import { formatMoney } from '@/core/money/format'
import type { Money } from '@/core/money/money'
import { toast } from '@/core/ui/toast-store'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import {
  destIsUser,
  sourceIsUser,
  TRANSFER_DIRECTIONS,
  type TransferDirection,
  type TransferType,
} from '@/data/transfer/transfer-model'
import {
  validateTransfer,
  type TransferField,
  type TransferFormError,
} from '@/data/transfer/transfer-validation'
import {
  useOperationAccounts,
  useSendTransfer,
  useSourceAssets,
  useUserBySubAccount,
} from '@/hooks/use-transfer'
import { messages } from '@/lib/messages'

import { TransferAccountField } from './transfer-account-field'
import {
  TransferConfirmSheet,
  type TransferSummary,
} from './transfer-confirm-sheet'

const text = messages.transfer

/** Бүтэн нарийвчлал, таслалгүй — оролтын талбарт буцааж бичихэд. */
function plain(money: Money): string {
  return formatMoney(money, {
    fractionDigits: money.currency.decimals,
    trimTrailingZeros: true,
    groupSeparator: '',
  })
}

/**
 * Вэбийн User/Sub transfer (`transfer-form.tsx`)-ийн нэг шилжүүлэг. Bulk,
 * promotion таб нь CSV шаарддаг тул mobile-д байхгүй.
 */
export function TransferScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()

  const [direction, setDirection] = useState<TransferDirection>('op-to-user')
  const [type, setType] = useState<TransferType>('mnt')
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [assetCode, setAssetCode] = useState<string>()
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<
    Partial<Record<TransferField, TransferFormError>>
  >({})
  const [summary, setSummary] = useState<
    (TransferSummary & { amount: Money }) | null
  >(null)

  const fromIsUser = sourceIsUser(direction)
  const toIsUser = destIsUser(direction)

  const accounts = useOperationAccounts()
  const fromUser = useUserBySubAccount(fromAccount, fromIsUser)
  const toUser = useUserBySubAccount(toAccount, toIsUser)
  const source = useSourceAssets({
    fromAccount,
    sourceIsUser: fromIsUser,
    type,
    sourceUserId: fromUser.user?.id,
  })
  const send = useSendTransfer()

  const allAccounts = accounts.data ?? []
  const assets = source.data?.assets ?? []
  const asset = assets.find((item) => item.asset === assetCode)

  function resetAmount() {
    setAssetCode(undefined)
    setAmount('')
  }

  function changeDirection(next: TransferDirection) {
    // Тал бүр жагсаалт ↔ бичих талбар хооронд солигддог тул цэвэрлэнэ.
    setDirection(next)
    setFromAccount('')
    setToAccount('')
    setErrors({})
    resetAmount()
  }

  function handleSubmit() {
    const result = validateTransfer({
      fromAccount,
      toAccount,
      asset,
      amount,
      reason,
      fromUserMissing: fromIsUser && fromUser.user === null,
      toUserMissing: toIsUser && toUser.user === null,
    })
    setErrors(result.errors)
    if (!result.amount || Object.keys(result.errors).length > 0) return

    setSummary({
      from: fromUser.user?.email
        ? `${fromAccount} · ${fromUser.user.email}`
        : fromAccount,
      to: toUser.user?.email
        ? `${toAccount} · ${toUser.user.email}`
        : toAccount,
      amount: result.amount,
      reason: reason.trim(),
    })
  }

  const errorText = (field: TransferField) => {
    const code = errors[field]
    return code ? text.errors[code] : undefined
  }

  return (
    <Screen>
      <AppHeader
        title={text.title}
        subtitle={text.subtitle}
        leading={
          openDrawer
            ? {
                icon: 'menu',
                label: messages.nav.openMenu,
                onPress: openDrawer,
              }
            : {
                icon: 'back',
                label: messages.nav.back,
                onPress: () => router.back(),
              }
        }
      />

      <ScrollView
        contentContainerClassName="gap-4 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1.5">
          <AppText variant="label">{text.direction}</AppText>
          <SegmentedControl
            options={TRANSFER_DIRECTIONS.map((value) => ({
              value,
              label: text.directions[value],
            }))}
            value={direction}
            onChange={changeDirection}
          />
        </View>

        <View className="gap-1.5">
          <AppText variant="label">{text.type}</AppText>
          <SegmentedControl
            options={(['mnt', 'crypto'] as const).map((value) => ({
              value,
              label: text.types[value],
            }))}
            value={type}
            onChange={(next) => {
              setType(next)
              resetAmount()
            }}
          />
        </View>

        <TransferAccountField
          label={text.from}
          isUser={fromIsUser}
          value={fromAccount}
          onChange={(value) => {
            setFromAccount(value)
            resetAmount()
          }}
          accounts={allAccounts.filter(
            (account) => account.subAccountId !== toAccount,
          )}
          accountsLoading={accounts.isPending}
          accountsError={accounts.error}
          onRetryAccounts={() => accounts.refetch()}
          matchedEmail={
            fromUser.user?.email ??
            (fromUser.user === null ? text.errors.userNotFound : undefined)
          }
          checking={fromUser.checking}
          error={errorText('fromAccount')}
        />

        <TransferAccountField
          label={text.to}
          isUser={toIsUser}
          value={toAccount}
          onChange={setToAccount}
          accounts={allAccounts.filter(
            (account) => account.subAccountId !== fromAccount,
          )}
          accountsLoading={accounts.isPending}
          accountsError={accounts.error}
          onRetryAccounts={() => accounts.refetch()}
          matchedEmail={
            toUser.user?.email ??
            (toUser.user === null ? text.errors.userNotFound : undefined)
          }
          checking={toUser.checking}
          error={errorText('toAccount')}
        />

        <SelectField
          label={text.asset}
          placeholder={text.assetPlaceholder}
          options={assets.map((item) => ({
            value: item.asset,
            label: item.asset,
            description: `${text.available}: ${plain(item.available)}`,
          }))}
          value={assetCode}
          onChange={(value) => {
            setAssetCode(value)
            setAmount('')
          }}
          disabled={!fromAccount.trim()}
          loading={source.isFetching}
          loadError={source.error}
          onRetry={() => source.refetch()}
          error={errorText('asset')}
        />
        {source.data?.unsupported.length ? (
          <AppText variant="caption">
            {`${text.unsupported}: ${source.data.unsupported.join(', ')}`}
          </AppText>
        ) : null}

        <View className="gap-1.5">
          <AppInput
            label={text.amount}
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            editable={asset !== undefined}
            error={errorText('amount')}
          />
          {asset ? (
            <View className="flex-row items-center justify-between">
              <AppText variant="caption">
                {`${text.available}: ${plain(asset.available)} ${asset.asset}`}
              </AppText>
              <TextButton
                label={text.max}
                onPress={() => setAmount(plain(asset.available))}
              />
            </View>
          ) : null}
        </View>

        <AppInput
          label={text.reason}
          placeholder={text.reasonPlaceholder}
          value={reason}
          onChangeText={setReason}
          multiline
          error={errorText('reason')}
        />

        <View className="pt-2">
          <AppButton
            label={text.submit}
            icon="transfer"
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>

      <TransferConfirmSheet
        summary={summary}
        onCancel={() => setSummary(null)}
        onConfirm={async (code) => {
          if (!summary) return
          await send.mutateAsync({
            code,
            input: {
              direction,
              fromAccount: fromAccount.trim(),
              toAccount: toAccount.trim(),
              amount: summary.amount,
              reason: summary.reason,
            },
          })
          toast.success(text.success)
          setSummary(null)
          resetAmount()
          setReason('')
          void source.refetch()
        }}
      />
    </Screen>
  )
}
