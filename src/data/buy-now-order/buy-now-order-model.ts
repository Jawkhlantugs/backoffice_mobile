import type { AmountField } from '@/core/money/format'

/** `buy-now.types.ts`-ийн `BuyNowOrder`. */
/** Вэбийн `buy-now/list/constants.ts`-ийн статусын шүүлтүүр. */
export const BUY_NOW_STATUSES = [
  'SUCCESS',
  'PENDING',
  'FAILED',
  'ERROR',
] as const
export type BuyNowStatus = (typeof BUY_NOW_STATUSES)[number]

export type BuyNowOrder = {
  id: string
  orderId?: string
  userEmail?: string
  userId?: string
  subAccountId?: string
  symbol?: string
  cryptoCurrency: string
  orderStatus: string
  userPayAmount: AmountField
  userGetAmount: AmountField
  userGetAmountFiat?: AmountField
  userTotalFee: AmountField
  quotePrice?: number
  /** `metadata.fromBuyerToUser.data.txnId`. */
  buyerToUserTxnId?: string
  createdAt?: string
}
