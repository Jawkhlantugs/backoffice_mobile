import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `depositSchema`. */
export type BankDeposit = {
  id: string
  userEmail?: string
  userId?: string
  currency: string
  depositAmount: AmountField
  txnAmount?: AmountField
  txnId?: string
  status: string
  transferTime?: string
  createdAt?: string
}
