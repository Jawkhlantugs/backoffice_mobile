import type { AmountField } from '@/core/money/format'

/** `users.types.ts`-ийн `UserCurrentBalanceResponse`. */
export type BalanceItem = {
  asset: string
  free: AmountField
  freeze: AmountField
  usdtValuation: AmountField
}

export type UserCurrentBalance = {
  spot: BalanceItem[]
  futures: BalanceItem[]
  fiat: BalanceItem[]
  totalUsdtValuation: AmountField
  totalMntValuation: AmountField
}
