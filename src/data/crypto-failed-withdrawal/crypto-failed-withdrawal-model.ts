/** `crypto.types.ts`-ийн `failedCryptoWithdrawalSchema` — мөнгөн дүн байхгүй. */
export type CryptoFailedWithdrawal = {
  id: string
  userEmail?: string
  userId?: string
  feeRefundStatus?: number
  mainRefundStatus?: number
  resolvedAt?: number
  resolvedBy?: string
  status?: string
  type?: string
  createdAt?: string
}
