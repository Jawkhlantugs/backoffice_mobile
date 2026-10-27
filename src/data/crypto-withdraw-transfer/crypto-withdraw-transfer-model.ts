import type { AmountField } from '@/core/money/format'

/** `crypto.types.ts`-ийн `withdrawTransferSchema`. */
export type CryptoWithdrawTransfer = {
  id: string
  userEmail?: string
  userId?: string
  /** `operationAccount.name` — вэбийн Identity баганын нөөц. */
  operationAccount?: string
  address?: string
  amount?: AmountField
  transactionFee?: AmountField
  receiveAmount?: AmountField
  coin: string
  network?: string
  txId?: string
  status: number
  transferType?: string
  usdtValuation?: number
  createdAt?: string
}
