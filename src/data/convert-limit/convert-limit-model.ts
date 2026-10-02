import type { AmountField } from '@/core/money/format'

/** `convert-limit.types.ts` — вэбийн анхдагч шүүлтүүр `OFFERED`. */
export const CONVERT_LIMIT_STATUSES = [
  'OFFERED',
  'COUNTER_OFFERED',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
  'REJECTED',
  'EXPIRED',
  'FAILED',
  'INITIATING',
  'SETTLING',
] as const
export type ConvertLimitStatus = (typeof CONVERT_LIMIT_STATUSES)[number]

export type ConvertLimitOrder = {
  id: string
  uid: string
  subAccountId?: string
  fromAsset: string
  toAsset: string
  amount: AmountField
  rate: string
  expectedTo: AmountField
  agreedRate?: string
  agreedAmount?: AmountField
  status: string
  note?: string
  offers: number
  lastActor?: string
  holdTxnId?: string
  payoutTxnId?: string
  refundTxnId?: string
  createdAt?: number
  updatedAt?: number
  expiresAt?: number
}
