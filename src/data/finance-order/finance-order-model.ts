import type { AmountField } from '@/core/money/format'

/**
 * Order (USDT/MNT зах) domain model. Талбарын нэр нь вэб админы
 * `services/types/portal/order-usdt.types.ts` / `order-mnt.types.ts`-аас —
 * хоёр endpoint яг ижил бүтэцтэй.
 */

export const ORDER_MARKETS = ['usdt', 'mnt'] as const
export type OrderMarket = (typeof ORDER_MARKETS)[number]

/** Вэбийн `usdt-mnt` / `ihc-mnt` `constants.ts`-ийн статусын шүүлтүүр (ижил). */
export const ORDER_STATUSES = [
  'NEW',
  'FILLED',
  'PARTIALLY_FILLED',
  'CANCELLED',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

/** Вэб `symbol`-ийг тогтмол илгээдэг (`TABLE_CONFIG.DEFAULT_SYMBOL`). */
export const ORDER_SYMBOLS: Record<OrderMarket, string> = {
  usdt: 'USDT_MNT',
  mnt: 'IHC_MNT',
}

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

/** Вэбийн `toListRequest`: `Math.min(100, Math.max(1, limit))`, анхдагч 20. */
export function orderLimit(raw: string | undefined): number {
  const limit = Number(raw) || DEFAULT_LIMIT
  return Math.min(MAX_LIMIT, Math.max(1, limit))
}

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
