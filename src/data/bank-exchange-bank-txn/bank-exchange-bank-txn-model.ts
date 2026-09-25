import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `exchangeBankTnxSchema`. */
export type BankExchangeBankTxn = {
  id: string
  amount?: AmountField
  amountType?: string
  beginBalance?: AmountField
  endBalance?: AmountField
  relatedAccountNumber?: string
  processStatus?: string
  txnTime?: string
  createdAt?: string
}
