import type { AmountField } from '@/core/money/format'

/** `spot.types.ts`-ийн `spotTradeOrderSchema`. */
export type SpotOrder = {
  id: string
  symbol: string
  side: string
  type: string
  status: string
  price: AmountField
  origQty?: string
  executedQty: string
  quoteQty: AmountField
  timeInForce: string
  clientOrderId: string
  user?: string
  transactTime: string
  createdAt?: string
}

/** `spotTradeHistorySchema` — `/spot/history/list`. */
export type SpotFill = {
  id: string
  symbol: string
  isBuyer: boolean
  isMaker: boolean
  price: AmountField
  qty: string
  quoteQty: AmountField
  commission?: AmountField
  commissionIncome?: string
  orderId?: string
  tradeStatus?: string
  user?: string
  createdAt: string
}

/** `tradeHistorySchema` — `/spot/trade-history/list`. */
export type SpotTrade = {
  id: string
  tradeId: string
  symbol: string
  asset: string
  rate?: string
  quote?: string
  formattedDate?: string
  isBuyerMaker?: boolean
  subAccountId?: string
  commissionTime?: string
  createdAt?: string
  side: string
  tradeType: string
  price: AmountField
  tokenAmount: AmountField
  usdtAmount: AmountField
  mntAmount: AmountField
  mntPrice: AmountField
  income?: string
  commissionStatus?: string
  user?: string
  postDate: string
}

/** `spotCommissionSchema`. */
export type SpotCommission = {
  id: string
  tradeId: string
  income: string
  isCollected: boolean
  status: string
  user?: string
  fetchedAt: string
  createdAt?: string
}

/** `spotSymbolSchema`. */
export type SpotSymbol = {
  id: string
  symbol: string
  baseAsset: string
  baseAssetName?: string
  quoteAsset: string
  status: string
  isEnabled: boolean
  isFeatured: boolean
  baseAssetPrecision: number
  quoteAssetPrecision: number
}
