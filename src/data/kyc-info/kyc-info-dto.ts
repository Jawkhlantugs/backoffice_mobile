import type { KycInfo } from './kyc-info-model'

export type KycInfoDto = {
  id: string
  created_at?: string
  uid?: string
  user?: {
    email?: string
    firstName?: string | null
    lastName?: string | null
  } | null
  kycStatus?: string | null
  verificationStatus?: string | null
  kycPassed?: number | null
  failReason?: string | null
  link_firstName?: string | null
  link_lastName?: string | null
  link_kycLevelName?: string | null
  link_riskLevel?: string | null
  link_riskScore?: number | null
  link_pep?: number | null
  link_sanctionHit?: number | null
  link_country?: string | null
  link_nationality?: string | null
  link_dob?: string | null
  link_documentType?: string | null
  link_documentId?: string | null
  link_expiryDate?: string | null
}

const opt = <T>(value: T | null | undefined) => value ?? undefined

export function toKycInfo(dto: KycInfoDto): KycInfo {
  const name = [
    dto.link_firstName ?? dto.user?.firstName,
    dto.link_lastName ?? dto.user?.lastName,
  ]
    .filter(Boolean)
    .join(' ')
  return {
    id: dto.id,
    uid: dto.uid ?? '',
    email: dto.user?.email,
    fullName: name || undefined,
    kycStatus: opt(dto.kycStatus),
    verificationStatus: opt(dto.verificationStatus),
    passed: dto.kycPassed === 1,
    failReason: opt(dto.failReason),
    levelName: opt(dto.link_kycLevelName),
    riskLevel: opt(dto.link_riskLevel),
    riskScore: opt(dto.link_riskScore),
    pep: dto.link_pep === 1,
    sanctionHit: dto.link_sanctionHit === 1,
    country: opt(dto.link_country),
    nationality: opt(dto.link_nationality),
    dob: opt(dto.link_dob),
    documentType: opt(dto.link_documentType),
    documentId: opt(dto.link_documentId),
    expiryDate: opt(dto.link_expiryDate),
    createdAt: dto.created_at ?? '',
  }
}
