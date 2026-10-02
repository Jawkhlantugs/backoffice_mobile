import type { MatchResult, MatchSide } from './match-engine-model'

/** Backend бүх утгыг мөрөөр буцаадаг (`is_cancel: '0' | '1'`). */
export type MatchResultDto = {
  match_id: string
  pair?: string
  match_price?: string
  is_cancel?: string
  created_at?: number
  maker_order_id?: string
  maker_user_id?: string
  maker_amount?: string
  maker_token?: string
  maker_type?: string
  maker_is_buyer?: string
  maker_txinID?: string
  maker_settlementId?: string
  maker_fee_amount?: string
  maker_fee_token?: string
  taker_order_id?: string
  taker_user_id?: string
  taker_amount?: string
  taker_token?: string
  taker_type?: string
  taker_is_buyer?: string
  taker_txinID?: string
  taker_settlementId?: string
  taker_fee_amount?: string
  taker_fee_token?: string
}

const isTrue = (value: string | undefined) => value === '1' || value === 'true'
const text = (value: string | undefined) => value || undefined

type SideDto = {
  orderId?: string
  userId?: string
  amount?: string
  token?: string
  type?: string
  isBuyer?: string
  txinId?: string
  settlementId?: string
  feeAmount?: string
  feeToken?: string
}

function toSide(dto: SideDto): MatchSide {
  return {
    orderId: dto.orderId ?? '',
    userId: dto.userId ?? '',
    amount: { raw: dto.amount || '0', currency: dto.token ?? '' },
    type: dto.type ?? '',
    isBuyer: isTrue(dto.isBuyer),
    txinId: text(dto.txinId),
    settlementId: text(dto.settlementId),
    fee: { raw: dto.feeAmount || '0', currency: dto.feeToken ?? '' },
  }
}

export function toMatchResult(dto: MatchResultDto): MatchResult {
  return {
    id: dto.match_id,
    pair: dto.pair ?? '',
    price: dto.match_price ?? '',
    cancelled: isTrue(dto.is_cancel),
    maker: toSide({
      orderId: dto.maker_order_id,
      userId: dto.maker_user_id,
      amount: dto.maker_amount,
      token: dto.maker_token,
      type: dto.maker_type,
      isBuyer: dto.maker_is_buyer,
      txinId: dto.maker_txinID,
      settlementId: dto.maker_settlementId,
      feeAmount: dto.maker_fee_amount,
      feeToken: dto.maker_fee_token,
    }),
    taker: toSide({
      orderId: dto.taker_order_id,
      userId: dto.taker_user_id,
      amount: dto.taker_amount,
      token: dto.taker_token,
      type: dto.taker_type,
      isBuyer: dto.taker_is_buyer,
      txinId: dto.taker_txinID,
      settlementId: dto.taker_settlementId,
      feeAmount: dto.taker_fee_amount,
      feeToken: dto.taker_fee_token,
    }),
    createdAt: dto.created_at,
  }
}
