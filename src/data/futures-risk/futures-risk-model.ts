import type { AmountField } from '@/core/money/format'

/**
 * `futures-transfer.types.ts`-ийн `BinanceFuturesMasterRiskData`. Бүх дүн
 * USDT-margined futures данс тул USDT гэж үзсэн (Binance-ийн энэ endpoint
 * зөвхөн USDⓈ-M — валютын код серверээс ирдэггүй, тиймээс таамаглал, доор
 * тэмдэглэсэн).
 */
export type FuturesMasterRisk = {
  environment: string
  canTrade?: boolean
  canWithdraw?: boolean
  totalWalletBalance: AmountField
  totalUnrealizedProfit: AmountField
  totalMarginBalance: AmountField
  availableBalance: AmountField
  marginRatioPercent?: string
  positions: FuturesPosition[]
  updatedAt?: number
}

export type FuturesPosition = {
  symbol: string
  positionAmt: string
  entryPrice?: string
  markPrice?: string
  unrealizedProfit: AmountField
  leverage?: string
  positionSide?: string
}

export type FuturesOpenOrder = {
  orderId: number
  symbol: string
  side?: string
  type?: string
  price?: string
  origQty?: string
  executedQty?: string
  status?: string
}
