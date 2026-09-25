/**
 * `users.types.ts`-ийн `kycInfoSchema`. Санах ойд л — диск/лог руу бичихгүй
 * (CLAUDE.md аюулгүй байдал §4). `initiateResponse`-ийг уншихгүй.
 */
export type KycInfo = {
  id: string
  uid: string
  email?: string
  fullName?: string
  kycStatus?: string
  verificationStatus?: string
  passed: boolean
  failReason?: string
  levelName?: string
  riskLevel?: string
  riskScore?: number
  pep: boolean
  sanctionHit: boolean
  country?: string
  nationality?: string
  dob?: string
  documentType?: string
  documentId?: string
  expiryDate?: string
  createdAt: string
}
