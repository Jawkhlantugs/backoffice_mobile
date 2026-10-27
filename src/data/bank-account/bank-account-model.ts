import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `walletSchema` — хэрэглэгчийн холбосон данс. */
/** Вэбийн `bank/wallets/constants.ts`-ийн статусын шүүлтүүр. */
export const BANK_WALLET_STATUSES = [
  'verified',
  'pending_verification',
] as const
export type BankWalletStatus = (typeof BANK_WALLET_STATUSES)[number]

export type UserBankWallet = {
  id: string
  owner?: string
  subAccountId?: string
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
  currency?: string
  status?: string
  usage?: string
  order?: number
  createdAt?: string
}

/** `balanceTransactionSchema` — дансны хөдөлгөөн (дебит/кредит). */
export type BalanceTransaction = {
  id: string
  subAccountId: string
  owner?: string
  txnId: string
  asset: string
  type: string
  credit: AmountField
  debit: AmountField
  before: AmountField
  after: AmountField
  isCredit: boolean
  createdAt: string
}
