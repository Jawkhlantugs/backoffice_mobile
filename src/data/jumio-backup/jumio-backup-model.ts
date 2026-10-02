/**
 * Jumio KYC нөөц — вэбийн `user-management/jumio-backup`. Зураг
 * (`images`, `liveness_images`) mobile-д уншихгүй, харуулахгүй (§11.4).
 */
export type JumioBackup = {
  id: string
  scanReference: string
  customerId?: string
  firstName?: string
  lastName?: string
  type?: string
  verified?: boolean
  country?: string
  createdAt: string
}
