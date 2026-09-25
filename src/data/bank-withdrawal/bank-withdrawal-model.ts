import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `withdrawalSchema`. */
export type BankWithdrawal = {
  id: string
  userEmail?: string
  userId?: string
  accountNumber?: string
  bankLabel?: string
  currency: string
  feeAmount?: AmountField
  receiveAmount?: AmountField
  totalAmount?: AmountField
  status: string
  transferTime?: string
  createdAt?: string
}
