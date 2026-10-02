import type { AmountField } from '@/core/money/format'

/** Вэбийн `match-engine.types.ts` — IHC/MNT, USDT/MNT биржийн тохиролт. */
export type MatchMarket = 'ihc-mnt' | 'usdt-mnt'

export type MatchSide = {
  orderId: string
  userId: string
  amount: AmountField
  type: string
  isBuyer: boolean
  txinId?: string
  settlementId?: string
  fee: AmountField
}

export type MatchResult = {
  id: string
  pair: string
  price: string
  cancelled: boolean
  maker: MatchSide
  taker: MatchSide
  createdAt?: number
}
