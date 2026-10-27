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
  EXCHANGE_BANK_TXN_AMOUNT_TYPES,
  type ExchangeBankTxnAmountType,
} from '@/data/bank-exchange-bank-txn/bank-exchange-bank-txn-model'
import {
  AMOUNT_CONDITIONS,
  isValidAmountFilter,
} from '@/data/shared/amount-filter'
import type { BankExchangeBankTxnFilters } from '@/hooks/use-bank-exchange-bank-txn'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { periodChips } from '@/lib/period-chips'

const text = messages.finance.filters
const ALL = 'all'

/** Вэбийн `EXCHANGE_TNX_FILTER_FIELDS` — статус нь жагсаалтын чип дээр. */
export function BankExchangeBankTxnFilterSheet({
  visible,
  value,
  onApply,
  onClose,
}: {
  visible: boolean
  value: BankExchangeBankTxnFilters
  onApply: (value: BankExchangeBankTxnFilters) => void
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

  const set = (patch: BankExchangeBankTxnFilters) =>
    setDraft((current) => ({ ...current, ...patch }))
  const textValue = (raw: string) => raw.trim() || undefined

  const apply = () => {
    if (draft.amount && !isValidAmountFilter(draft.amount)) {
      setAmountError(text.invalidAmount)
      return
    }
    onApply({
      ...draft,
      condition: draft.amount ? (draft.condition ?? 'EQUAL') : undefined,
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
          label={text.txnId}
          value={draft.id ?? ''}
          onChangeText={(raw) => set({ id: textValue(raw) })}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ChoiceField<ExchangeBankTxnAmountType | typeof ALL>
          label={text.amountType}
          options={[
            { value: ALL, label: messages.common.all },
            ...EXCHANGE_BANK_TXN_AMOUNT_TYPES.map((type) => ({
              value: type,
              label: messages.finance.amountTypes[type],
            })),
          ]}
          value={draft.amountType ?? ALL}
          onChange={(type) =>
            set({ amountType: type === ALL ? undefined : type })
          }
        />
        <AppInput
          label={text.mainAccountNumber}
          value={draft.mainAccountNumber ?? ''}
          onChangeText={(raw) => set({ mainAccountNumber: textValue(raw) })}
          keyboardType="number-pad"
        />
        <AppInput
          label={text.relatedAccountNumber}
          value={draft.relatedAccountNumber ?? ''}
          onChangeText={(raw) => set({ relatedAccountNumber: textValue(raw) })}
          keyboardType="number-pad"
        />
        <AppInput
          label={text.amount}
          value={draft.amount ?? ''}
          onChangeText={(raw) => {
            setAmountError(undefined)
            set({ amount: textValue(raw) })
          }}
          keyboardType="decimal-pad"
          error={amountError}
        />
        {draft.amount ? (
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
