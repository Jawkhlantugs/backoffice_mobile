import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `walletSchema` — хэрэглэгчийн холбосон данс. */
export type UserBankWallet = {
  id: string
  owner?: string
  bankName?: string
  accountName?: string
  accountNumber?: string
  iban?: string
  walletCode?: string
  status?: string
  verifiedAt?: string
  createdAt: string
}

/** `exchangeBankWalletsSchema` — биржийн өөрийн данс. */
export type ExchangeBankWallet = {
  id: string
  accountName?: string
  accountNumber?: string
  bankCode?: string
  iban?: string
  balance?: AmountField
  status?: string
  usage?: string
  order?: number
}

/** `balanceTransactionSchema` — дансны хөдөлгөөн (дебит/кредит). */
export type BalanceTransaction = {
  id: string
  subAccountId: string
  owner?: string
  txnId: string
  type: string
  credit: AmountField
  debit: AmountField
  before: AmountField
  after: AmountField
  isCredit: boolean
  createdAt: string
}
