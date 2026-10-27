import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `exchangeBankTnxSchema`. */
export type BankExchangeBankTxn = {
  id: string
  amount?: AmountField
  amountType?: string
  beginBalance?: AmountField
  endBalance?: AmountField
  description?: string
  mainAccountNumber?: string
  relatedAccountNumber?: string
  processStatus?: string
  txnTime?: string
  createdAt?: string
}

/** Вэбийн `exchange-txn/constants.ts`-ийн шүүлтүүрийн утгууд. */
export const EXCHANGE_BANK_TXN_STATUSES = [
  'PROCESSED',
  'PENDING',
  'SOLVED',
  'REFUNDED',
  'MANUAL_REFUND',
] as const
export type ExchangeBankTxnStatus = (typeof EXCHANGE_BANK_TXN_STATUSES)[number]

export const EXCHANGE_BANK_TXN_AMOUNT_TYPES = ['DEPOSIT', 'WITHDRAWAL'] as const
export type ExchangeBankTxnAmountType =
  (typeof EXCHANGE_BANK_TXN_AMOUNT_TYPES)[number]
