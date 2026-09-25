import type { AmountField } from '@/core/money/format'

/** `crypto.types.ts`-ийн `cryptoWithdrawalSchema`. */
export type CryptoWithdrawal = {
  id: string
  userEmail?: string
  userId?: string
  address?: string
  amount: AmountField
  receiveAmount?: AmountField
  network?: string
  status: number
  txnId?: string
  transferStatus?: string
  usdtValuation?: number
  createdAt?: string
}
