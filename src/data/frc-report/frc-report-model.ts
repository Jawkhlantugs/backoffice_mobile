import type { AmountField } from '@/core/money/format'

/**
 * Санхүүгийн зохицуулах хорооны (FRC) тайлан — вэбийн `portal/reports/frc-*`.
 * Бүх дүн backend-ээс JSON тоо — `AmountField`-ээр, тооцоололгүй (§10).
 */
type Party = { uid: string; email?: string; subAccountId: string }

export type FrcCryptoDeposit = Party & {
  id: string
  coin: string
  amount: AmountField
  priceUsd: AmountField
  priceMnt: AmountField
  totalMnt: AmountField
  rate: AmountField
  fromAddress?: string
  toAddress?: string
  txId?: string
  createdAt: string
}

export type FrcCryptoWithdraw = Party & {
  id: string
  asset: string
  amount: AmountField
  priceUsd: AmountField
  priceMnt: AmountField
  totalMnt: AmountField
  rate: AmountField
  from?: string
  to?: string
  createdAt: string
  finishedAt?: string
}

export type FrcTrade = Party & {
  id: string
  symbol: string
  tradeType: string
  priceUsd: AmountField
  priceMnt: AmountField
  tokenAmount: string
  usdtAmount: AmountField
  mntAmount: AmountField
  rate: AmountField
  date: string
}

export type FrcBankDeposit = Party & {
  id: string
  amount: AmountField
  bankName?: string
  accountNumber?: string
  status: string
  postDate: string
}

export type FrcBankWithdraw = Party & {
  id: string
  amount: AmountField
  bankName?: string
  accountNumber?: string
  status: string
  date: string
}

export type FrcConvert = Party & {
  id: string
  fromAmount: AmountField
  toAmount: AmountField
  rate: string
  status: string
  postDate: string
}
