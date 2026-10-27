import type { AmountField } from '@/core/money/format'

/** `crypto.types.ts`-ийн `coinSchema` — бүртгэлийн жагсаалтад. */
export type CoinListing = {
  id: string
  coin: string
  name: string
  isEnabled: boolean
  isFeatured: boolean
  trading: boolean
  depositEnabled: boolean
  withdrawEnabled: boolean
  networks: string[]
  createdAt?: string
}

/** `walletAddressSchema` — хэрэглэгчийн deposit хаяг. */
export type UserWalletAddress = {
  id: string
  owner?: string
  userEmail?: string
  address?: string
  coin?: string
  coinNetwork?: string
  network?: string
  url?: string
  tag?: string
  isDefault: boolean
  createdAt: string
}

/** `withdrawBanSchema` — хэрэглэгчийн татах хориг. */
export type WithdrawBan = {
  id: string
  owner?: string
  userId?: string
  userEmail?: string
  reason?: string
  status?: string
  startTime?: string
  endTime?: string
  createdAt: string
}

/** `delistedCoinTransferSchema`. */
export type DelistedTransfer = {
  id: string
  owner?: string
  subAccountId?: string
  userEmail?: string
  asset?: string
  amount?: AmountField
  returnAmount?: AmountField
  price?: string
  usdtValuation?: AmountField
  status?: string
  txnId?: string
  returnTxnId?: string
  createdAt: string
}
