import type { AmountField } from '@/core/money/format'

/** `buy-now.types.ts`-ийн `BuyNowOrder`. */
export type BuyNowOrder = {
  id: string
  orderId?: string
  userEmail?: string
  userId?: string
  symbol?: string
  cryptoCurrency: string
  orderStatus: string
  userPayAmount: AmountField
  userGetAmount: AmountField
  userTotalFee: AmountField
  createdAt?: string
}
