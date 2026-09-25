import type { AmountField } from '@/core/money/format'

/** `crypto.types.ts`-ийн `withdrawTransferSchema`. */
export type CryptoWithdrawTransfer = {
  id: string
  userEmail?: string
  userId?: string
  address?: string
  amount?: AmountField
  transactionFee?: AmountField
  receiveAmount?: AmountField
  network?: string
  txId?: string
  status: number
  transferType?: string
  usdtValuation?: number
  createdAt?: string
}
