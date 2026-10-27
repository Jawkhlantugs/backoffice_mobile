import type { ConvertRecord } from './convert-model'

/** Серверийн JSON — `convert.types.ts`-ийн `ConvertRecord`. */
export type ConvertRecordDto = {
  id?: string
  UserId?: string | null
  brokerUserId?: string
  fromAmount?: number
  fromAsset?: string
  fromTxnId?: string | null
  toAmount?: number
  toAsset?: string
  toTxnId?: string | null
  postDate?: string
  subAccountId?: string
  brokerUser?: { subAccountId?: string } | null
  updated_at?: string
  rate?: string | null
  status?: string
  created_at?: string
  User?: { id?: string; email?: string }
}

export function toConvertRecord(dto: ConvertRecordDto): ConvertRecord {
  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.UserId ?? dto.brokerUserId ?? undefined,
    subId:
      dto.subAccountId ||
      dto.brokerUser?.subAccountId ||
      dto.UserId ||
      dto.brokerUserId ||
      undefined,
    fromAmount: { raw: dto.fromAmount ?? 0, currency: dto.fromAsset ?? '' },
    fromAsset: dto.fromAsset ?? '',
    fromTxnId: dto.fromTxnId ?? undefined,
    toAmount: { raw: dto.toAmount ?? 0, currency: dto.toAsset ?? '' },
    toAsset: dto.toAsset ?? '',
    toTxnId: dto.toTxnId ?? undefined,
    postDate: dto.postDate,
    rate: dto.rate ?? undefined,
    status: dto.status ?? '',
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}
