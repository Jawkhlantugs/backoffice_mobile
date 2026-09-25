import type { AmountField } from '@/core/money/format'

export const FUTURES_TRANSFER_STATUSES = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'APPROVED',
  'REJECTED',
  'FAILED',
] as const
export type FuturesTransferStatus = (typeof FUTURES_TRANSFER_STATUSES)[number]

/** `futures-transfer.types.ts`-ийн `RawFuturesTransferRequest`. */
export type FuturesTransferRequest = {
  txnId: string
  userId?: string
  amount: AmountField
  direction?: string
  status: FuturesTransferStatus
  createdAt?: number
}
