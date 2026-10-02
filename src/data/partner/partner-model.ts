import type { AmountField } from '@/core/money/format'

/** `partner.types.ts` — backend зөвхөн эдгээр гурвыг гаргадаг. */
export const PARTNER_STATUSES = ['pending', 'active', 'suspended'] as const
export type PartnerStatus = (typeof PARTNER_STATUSES)[number]

export const APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const
export const COMMISSION_STATUSES = [
  'pending',
  'approved',
  'paid',
  'cancelled',
] as const
export const PAYOUT_STATUSES = [
  'pending',
  'approved',
  'processed',
  'rejected',
] as const
export const REFERRAL_STATUSES = [
  'registered',
  'deposited',
  'active',
  'inactive',
  'unlinked',
] as const

export type Partner = {
  id: string
  email?: string
  name?: string
  companyName?: string
  website?: string
  tier?: string
  referralCode?: string
  totalReferrals: number
  /** USD — вэб `$` + 2 орон. */
  totalEarnings: AmountField
  status: string
  kycLevel?: number
  createdAt: string
}

export type PartnerApplication = {
  id: string
  email?: string
  name?: string
  kycLevel?: number
  companyName?: string
  website?: string
  audienceSize?: string
  promotionPlan?: string
  status: string
  createdAt: string
  reviewedAt?: string
  reviewer?: string
  rejectionReason?: string
}

export type PartnerCommission = {
  id: string
  referredUser?: string
  partner?: string
  marketId?: string
  asset: string
  volumeUsd: AmountField
  commission: AmountField
  /** Харьцаа (0.2 = 20%). */
  commissionRate: number
  rebate: AmountField
  status: string
  positionId?: string
  tradeDate: string
}

export type PartnerPayout = {
  id: string
  partner: string
  amount: AmountField
  commissionCount: number
  periodStart: string
  periodEnd: string
  status: string
  processedAt?: string
  transactionId?: string
  failureReason?: string
  createdAt: string
}

export type PartnerReferral = {
  id: string
  referredUser?: string
  referredName?: string
  partner?: string
  code?: string
  kycLevel: number
  status: string
  registeredAt?: string
  firstDepositAt?: string
  firstTradeAt?: string
  endedAt?: string
}

export type PartnerTier = {
  id: string
  name: string
  level: number
  commissionRate: number
  minActiveClients: number
  minVolume: AmountField
  maxVolume?: AmountField
  isDefault: boolean
}

export type PartnerAnalyticsSummary = {
  totalPartners: number
  activePartners: number
  totalApplications: number
  pendingApplications: number
  totalCommissions: AmountField
  totalPayouts: number
  pendingPayouts: number
}

/** `analytics.go::ReferralFunnel`. */
export type ReferralFunnel = {
  clicks: number
  registrations: number
  deposits: number
  traders: number
}
