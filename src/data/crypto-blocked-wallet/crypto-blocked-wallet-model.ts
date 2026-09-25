/** `crypto.types.ts`-ийн `blockedWithdrawWalletSchema` — мөнгөн дүн байхгүй. */
export type CryptoBlockedWallet = {
  id: string
  address: string
  network: string
  createdByLabel?: string
  reason?: string
  status: number
  createdAt?: string
}
