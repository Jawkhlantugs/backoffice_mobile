import type { ConvertLimitOrder } from './convert-limit-model'

export type ConvertLimitOrderDto = {
  id: string
  uid?: string
  subAccountId?: string
  fromAsset?: string
  toAsset?: string
  currentAmount?: number
  currentRate?: number
  expectedToAmount?: number
  agreedAmount?: number
  agreedRate?: number
  status?: string
  note?: string
  offers?: unknown[]
  lastActor?: string
  holdTxnId?: string
  payoutTxnId?: string
  refundTxnId?: string
  createTime?: number
  updateTime?: number
  expireTime?: number
}

const text = (value: string | undefined) => value || undefined

export function toConvertLimitOrder(
  dto: ConvertLimitOrderDto,
): ConvertLimitOrder {
  const fromAsset = dto.fromAsset ?? ''
  const toAsset = dto.toAsset ?? ''
  return {
    id: dto.id,
    uid: dto.uid ?? '',
    subAccountId: text(dto.subAccountId),
    fromAsset,
    toAsset,
    amount: { raw: dto.currentAmount ?? 0, currency: fromAsset },
    rate: String(dto.currentRate ?? ''),
    expectedTo: { raw: dto.expectedToAmount ?? 0, currency: toAsset },
    agreedRate:
      dto.agreedRate === undefined ? undefined : String(dto.agreedRate),
    agreedAmount:
      dto.agreedAmount === undefined
        ? undefined
        : { raw: dto.agreedAmount, currency: fromAsset },
    status: dto.status ?? '',
    note: text(dto.note),
    offers: dto.offers?.length ?? 0,
    lastActor: text(dto.lastActor),
    holdTxnId: text(dto.holdTxnId),
    payoutTxnId: text(dto.payoutTxnId),
    refundTxnId: text(dto.refundTxnId),
    createdAt: dto.createTime,
    updatedAt: dto.updateTime,
    expiresAt: dto.expireTime,
  }
}
