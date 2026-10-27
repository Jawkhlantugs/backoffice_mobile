import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import {
  AppButton,
  AppInput,
  AppText,
  BackofficeBottomSheet,
  ChoiceField,
  FilterChips,
} from '@/components'
import {
  AMOUNT_CONDITIONS,
  isValidAmountFilter,
} from '@/data/shared/amount-filter'
import type { BankWithdrawalFilters } from '@/hooks/use-bank-withdrawals'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { periodChips } from '@/lib/period-chips'

const text = messages.finance.filters
const f = messages.finance.fields
const ALL = 'all'

/** Вэбийн `WITHDRAWAL_FILTER_FIELDS` — статус нь жагсаалтын чип дээр. */
export function BankWithdrawalFilterSheet({
  visible,
  value,
  onApply,
  onClose,
}: {
  visible: boolean
  value: BankWithdrawalFilters
  onApply: (value: BankWithdrawalFilters) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(value)
  const [amountError, setAmountError] = useState<string>()
  const [wasVisible, setWasVisible] = useState(visible)

  // Нээх бүрд хэрэглэгдэж буй шүүлтүүрээс эхэлнэ — хаасан ноорог үлдэхгүй.
  if (visible !== wasVisible) {
    setWasVisible(visible)
    if (visible) {
      setDraft(value)
      setAmountError(undefined)
    }
  }

  const set = (patch: BankWithdrawalFilters) =>
    setDraft((current) => ({ ...current, ...patch }))
  const textValue = (raw: string) => raw.trim() || undefined

  const apply = () => {
    if (draft.totalAmount && !isValidAmountFilter(draft.totalAmount)) {
      setAmountError(text.invalidAmount)
      return
    }
    onApply({
      ...draft,
      condition: draft.totalAmount ? (draft.condition ?? 'EQUAL') : undefined,
    })
    onClose()
  }

  return (
    <BackofficeBottomSheet
      visible={visible}
      title={text.open}
      onClose={onClose}
    >
      <ScrollView
        className="shrink"
        contentContainerClassName="gap-4"
        keyboardShouldPersistTaps="handled"
      >
        <AppInput
          label={text.withdrawalId}
          value={draft.id ?? ''}
          onChangeText={(raw) => set({ id: textValue(raw) })}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <AppInput
          label={f.txnId}
          value={draft.txnId ?? ''}
          onChangeText={(raw) => set({ txnId: textValue(raw) })}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <AppInput
          label={f.accountNumber}
          value={draft.accountNumber ?? ''}
          onChangeText={(raw) => set({ accountNumber: textValue(raw) })}
          keyboardType="number-pad"
        />
        <AppInput
          label={f.totalAmount}
          value={draft.totalAmount ?? ''}
          onChangeText={(raw) => {
            setAmountError(undefined)
            set({ totalAmount: textValue(raw) })
          }}
          keyboardType="decimal-pad"
          error={amountError}
        />
        {draft.totalAmount ? (
          <ChoiceField
            label={text.condition}
            options={AMOUNT_CONDITIONS.map((condition) => ({
              value: condition,
              label: text.conditions[condition],
            }))}
            value={draft.condition ?? 'EQUAL'}
            onChange={(condition) => set({ condition })}
          />
        ) : null}
        <View className="gap-1.5">
          <AppText variant="label">{text.period}</AppText>
          <FilterChips<RangePeriod | typeof ALL>
            chips={[
              { value: ALL, label: messages.common.all },
              ...periodChips(),
            ]}
            value={draft.period ?? ALL}
            onChange={(period) =>
              set({ period: period === ALL ? undefined : period })
            }
          />
        </View>
      </ScrollView>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppButton
            label={text.reset}
            variant="secondary"
            onPress={() => {
              onApply({})
              onClose()
            }}
          />
        </View>
        <View className="flex-1">
          <AppButton label={text.apply} icon="filter" onPress={apply} />
        </View>
      </View>
    </BackofficeBottomSheet>
  )
}
