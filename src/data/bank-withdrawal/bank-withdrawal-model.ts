import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `withdrawalSchema`. */
export type BankWithdrawal = {
  id: string
  userEmail?: string
  userId?: string
  accountNumber?: string
  bankCode?: string
  paymentWalletId?: string
  currency: string
  feeAmount?: AmountField
  serviceFee?: AmountField
  serviceFeeTxnId?: string
  txnFeeTxnId?: string
  txnTaskId?: string
  receiveAmount?: AmountField
  totalAmount?: AmountField
  status: string
  transferTime?: string
  createdAt?: string
}

/** Вэбийн `withdrawal/constants.ts`-ийн статусын шүүлтүүр (`BankStatus`). */
export const BANK_WITHDRAWAL_STATUSES = [
  'TRANSFERRED',
  'CANCELLED',
  'PENDING',
  'PROCESSING',
] as const
export type BankWithdrawalStatus = (typeof BANK_WITHDRAWAL_STATUSES)[number]
