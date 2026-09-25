import { useState } from 'react'
import { View } from 'react-native'

import { AppButton, AppInput, BottomSheet, InfoRow } from '@/components'
import { formatMoney } from '@/core/money/format'
import type { Money } from '@/core/money/money'
import { amountMatches } from '@/data/transfer/transfer-validation'
import { messages } from '@/lib/messages'

const text = messages.transfer
const CODE = /^\d{6}$/

export type TransferSummary = {
  from: string
  to: string
  amount: Money
  reason: string
}

/**
 * Вэбийн `TransferConfirmationDialog` + step-up MFA нэг хавтанд: дүнг
 * дахин бичиж, 2FA код оруулсны дараа л Шилжүүлэх идэвхжинэ.
 */
export function TransferConfirmSheet({
  summary,
  onConfirm,
  onCancel,
}: {
  summary: TransferSummary | null
  onConfirm: (code: string) => Promise<void>
  onCancel: () => void
}) {
  const [typedAmount, setTypedAmount] = useState('')
  const [code, setCode] = useState('')

  const [shown, setShown] = useState(summary)
  if (summary !== shown) {
    setShown(summary)
    setTypedAmount('')
    setCode('')
  }

  // Дахин бичих дүн нь бүтэн нарийвчлалтай, тэмдэггүй — яг энэ хэлбэрээр бичнэ.
  const plainAmount = summary
    ? formatMoney(summary.amount, {
        fractionDigits: summary.amount.currency.decimals,
        trimTrailingZeros: true,
        groupSeparator: '',
      })
    : ''
  const ready =
    summary !== null &&
    amountMatches(typedAmount, summary.amount) &&
    CODE.test(code)

  return (
    <BottomSheet
      visible={summary !== null}
      title={text.confirm.title}
      onClose={onCancel}
    >
      {summary ? (
        <View className="gap-2 rounded-lg bg-muted p-3">
          <InfoRow label={text.from} value={summary.from} />
          <InfoRow label={text.to} value={summary.to} />
          <InfoRow
            label={text.amount}
            value={`${plainAmount} ${summary.amount.currency.code}`}
          />
          <InfoRow label={text.reason} value={summary.reason} />
        </View>
      ) : null}

      <AppInput
        label={text.confirm.retype}
        placeholder={plainAmount}
        value={typedAmount}
        onChangeText={setTypedAmount}
        keyboardType="decimal-pad"
      />
      <AppInput
        label={text.confirm.code}
        placeholder={text.confirm.codePlaceholder}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={6}
      />

      <View className="gap-2">
        <AppButton
          label={text.confirm.send}
          icon="send"
          variant="destructive"
          disabled={!ready}
          onPress={() => onConfirm(code)}
        />
        <AppButton
          label={messages.common.cancel}
          variant="ghost"
          onPress={onCancel}
        />
      </View>
    </BottomSheet>
  )
}
