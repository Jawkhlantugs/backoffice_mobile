import type { AmountField } from '@/core/money/format'

/**
 * Order (USDT/MNT зах) domain model. Талбарын нэр нь вэб админы
 * `services/types/portal/order-usdt.types.ts` / `order-mnt.types.ts`-аас —
 * хоёр endpoint яг ижил бүтэцтэй.
 */

export const ORDER_MARKETS = ['usdt', 'mnt'] as const
export type OrderMarket = (typeof ORDER_MARKETS)[number]

export type OrderSide = 'BUY' | 'SELL'
export type OrderType = 'LIMIT' | 'MARKET'

export type FinanceOrder = {
  orderId: string
  uid: string
  symbol: string
  side: OrderSide
  type: OrderType
  baseAsset: string
  quoteAsset: string
  quantity: AmountField
  executedQty: AmountField
  remaining: AmountField
  price: AmountField
  amount?: AmountField
  returnAmount: AmountField
  status: string
  timestamp?: number
  updatedAt?: number
}
