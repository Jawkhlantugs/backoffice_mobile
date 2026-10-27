/** `crypto.types.ts`-ийн `failedCryptoWithdrawalSchema` — мөнгөн дүн байхгүй. */
export type CryptoFailedWithdrawal = {
  id: string
  userEmail?: string
  userId?: string
  /** Вэбийн «User ID» багана — `uid`. */
  uid?: string
  feeRefundStatus?: number
  mainRefundStatus?: number
  resolvedAt?: number
  resolvedBy?: string
  status?: string
  type?: string
  createdAt?: string
}
