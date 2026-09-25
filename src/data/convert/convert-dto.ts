import type { ConvertRecord } from './convert-model'

/** Серверийн JSON — `convert.types.ts`-ийн `ConvertRecord`. */
export type ConvertRecordDto = {
  id?: string
  UserId?: string | null
  brokerUserId?: string
  fromAmount?: number
  fromAsset?: string
  toAmount?: number
  toAsset?: string
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
    fromAmount: { raw: dto.fromAmount ?? 0, currency: dto.fromAsset ?? '' },
    toAmount: { raw: dto.toAmount ?? 0, currency: dto.toAsset ?? '' },
    rate: dto.rate ?? undefined,
    status: dto.status ?? '',
    createdAt: dto.created_at,
  }
}
