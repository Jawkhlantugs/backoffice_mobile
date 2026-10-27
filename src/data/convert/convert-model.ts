import type { AmountField } from '@/core/money/format'

/** Convert domain model — вэб админы `convert.types.ts`-ийн `ConvertRecord`. */
/** Вэбийн `convert/list/constants.ts`-ийн статусын шүүлтүүр. */
export const CONVERT_STATUSES = [
  'COMPLETED',
  'PENDING',
  'PARTIALLY_COMPLETED',
  'FAILED',
] as const
export type ConvertStatus = (typeof CONVERT_STATUSES)[number]

export type ConvertRecord = {
  id: string
  userEmail?: string
  userId?: string
  /** `subAccountId || brokerUser.subAccountId || UserId || brokerUserId`. */
  subId?: string
  fromAmount: AmountField
  fromAsset: string
  fromTxnId?: string
  toAmount: AmountField
  toAsset: string
  toTxnId?: string
  postDate?: string
  rate?: string
  status: string
  createdAt?: string
  updatedAt?: string
}
