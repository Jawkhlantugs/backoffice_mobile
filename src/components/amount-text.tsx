import { formatAmountSafe, type AmountField } from '@/core/money/format'

import { AppText, type AppTextProps } from './app-text'

/** Finance жагсаалтын мөнгөн дүн — `undefined` бол зураас. */
export function AmountText({
  amount,
  ...rest
}: { amount?: AmountField } & Omit<AppTextProps, 'children' | 'numeric'>) {
  return (
    <AppText numeric {...rest}>
      {amount ? formatAmountSafe(amount.raw, amount.currency) : '—'}
    </AppText>
  )
}
