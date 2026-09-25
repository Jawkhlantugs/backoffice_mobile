import type { FinanceOrder, OrderSide, OrderType } from './finance-order-model'

/** Серверийн JSON — `OrderUsdt`/`OrderMnt`-тэй ижил (хоёулаа number дүнтэй). */
export type FinanceOrderDto = {
  orderId?: string
  uid?: string
  symbol?: string
  side?: string
  type?: string
  baseAsset?: string
  quoteAsset?: string
  quantity?: number
  executedQty?: number
  remaining?: number
  price?: number
  amount?: number | null
  returnAmount?: number
  status?: string
  timestamp?: number
  updatedAt?: number
}

const KNOWN_SIDES: OrderSide[] = ['BUY', 'SELL']
const KNOWN_TYPES: OrderType[] = ['LIMIT', 'MARKET']

export function toFinanceOrder(dto: FinanceOrderDto): FinanceOrder {
  const baseAsset = dto.baseAsset ?? ''
  const quoteAsset = dto.quoteAsset ?? ''

  return {
    orderId: dto.orderId ?? '',
    uid: dto.uid ?? '',
    symbol: dto.symbol ?? '',
    side: KNOWN_SIDES.find((side) => side === dto.side) ?? 'BUY',
    type: KNOWN_TYPES.find((type) => type === dto.type) ?? 'LIMIT',
    baseAsset,
    quoteAsset,
    quantity: { raw: dto.quantity ?? 0, currency: baseAsset },
    executedQty: { raw: dto.executedQty ?? 0, currency: baseAsset },
    remaining: { raw: dto.remaining ?? 0, currency: baseAsset },
    price: { raw: dto.price ?? 0, currency: quoteAsset },
    amount:
      dto.amount === null || dto.amount === undefined
        ? undefined
        : { raw: dto.amount, currency: quoteAsset },
    returnAmount: { raw: dto.returnAmount ?? 0, currency: quoteAsset },
    status: dto.status ?? '',
    timestamp: dto.timestamp,
    updatedAt: dto.updatedAt,
  }
}
