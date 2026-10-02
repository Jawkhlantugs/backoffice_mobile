import type {
  Partner,
  PartnerAnalyticsSummary,
  PartnerApplication,
  PartnerCommission,
  PartnerPayout,
  PartnerReferral,
  PartnerTier,
  ReferralFunnel,
} from './partner-model'

/** Partner API-ийн мөнгөн дүн бүгд USD (`truncateFloor(…, 2)` + `$`). */
const USD = 'USD'

type UserDto = {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  kycLevel?: number
} | null

type TierDto = {
  id: string
  name?: string
  level?: number
  commissionRate?: number
  minActiveClients?: number
  minVolume?: number
  maxVolume?: number | null
  isDefault?: boolean
}

export type PartnerDto = {
  id: string
  createdAt?: string
  user?: UserDto
  companyName?: string
  website?: string
  tier?: TierDto | null
  status?: string
  referralCode?: string
  totalReferrals?: number
  totalEarnings?: number
}

export type PartnerApplicationDto = {
  id: string
  createdAt?: string
  user?: UserDto
  companyName?: string
  website?: string
  audienceSize?: string
  promotionPlan?: string
  status?: string
  reviewer?: { email?: string } | null
  reviewedAt?: string | null
  rejectionReason?: string
}

export type PartnerCommissionDto = {
  id: string
  partner?: PartnerDto | null
  referredUser?: UserDto
  positionId?: string
  marketId?: string
  asset?: string
  commissionAmount?: number
  volumeUsd?: number
  commissionRate?: number
  rebateAmount?: number
  status?: string
  tradeDate?: string
}

export type PartnerPayoutDto = {
  id: string
  createdAt?: string
  partnerId?: string
  partner?: PartnerDto | null
  amount?: number
  currency?: string
  commissionCount?: number
  periodStart?: string
  periodEnd?: string
  status?: string
  processedAt?: string | null
  transactionId?: string
  failureReason?: string
}

export type PartnerReferralDto = {
  id: string
  partner?: PartnerDto | null
  referredUser?: UserDto
  referralLink?: { code?: string } | null
  status?: string
  registeredAt?: string
  firstDepositAt?: string | null
  firstTradeAt?: string | null
  endedAt?: string | null
}

export type PartnerAnalyticsSummaryDto = {
  totalPartners?: number
  activePartners?: number
  totalApplications?: number
  pendingApplications?: number
  totalCommissions?: number
  totalPayouts?: number
  pendingPayouts?: number
}

const fullName = (user: UserDto | undefined) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ') || undefined

const optional = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined

export function toPartner(dto: PartnerDto): Partner {
  return {
    id: dto.id,
    email: optional(dto.user?.email),
    name: fullName(dto.user),
    companyName: dto.companyName || undefined,
    website: dto.website || undefined,
    tier: optional(dto.tier?.name),
    referralCode: dto.referralCode || undefined,
    totalReferrals: dto.totalReferrals ?? 0,
    totalEarnings: { raw: dto.totalEarnings ?? 0, currency: USD },
    status: dto.status ?? '',
    kycLevel: optional(dto.user?.kycLevel),
    createdAt: dto.createdAt ?? '',
  }
}

export function toPartnerApplication(
  dto: PartnerApplicationDto,
): PartnerApplication {
  return {
    id: dto.id,
    email: optional(dto.user?.email),
    name: fullName(dto.user),
    kycLevel: optional(dto.user?.kycLevel),
    companyName: dto.companyName || undefined,
    website: dto.website || undefined,
    audienceSize: dto.audienceSize || undefined,
    promotionPlan: dto.promotionPlan || undefined,
    status: dto.status ?? '',
    createdAt: dto.createdAt ?? '',
    reviewedAt: optional(dto.reviewedAt),
    reviewer: optional(dto.reviewer?.email),
    rejectionReason: dto.rejectionReason || undefined,
  }
}

export function toPartnerCommission(
  dto: PartnerCommissionDto,
): PartnerCommission {
  const asset = dto.asset ?? ''
  return {
    id: dto.id,
    referredUser: optional(dto.referredUser?.email),
    partner: optional(dto.partner?.user?.email),
    marketId: dto.marketId || undefined,
    asset,
    volumeUsd: { raw: dto.volumeUsd ?? 0, currency: USD },
    commission: { raw: dto.commissionAmount ?? 0, currency: asset },
    commissionRate: dto.commissionRate ?? 0,
    rebate: { raw: dto.rebateAmount ?? 0, currency: asset },
    status: dto.status ?? '',
    positionId: dto.positionId || undefined,
    tradeDate: dto.tradeDate ?? '',
  }
}

export function toPartnerPayout(dto: PartnerPayoutDto): PartnerPayout {
  return {
    id: dto.id,
    partner: dto.partner?.user?.email || dto.partnerId || dto.id,
    amount: { raw: dto.amount ?? 0, currency: dto.currency || USD },
    commissionCount: dto.commissionCount ?? 0,
    periodStart: dto.periodStart ?? '',
    periodEnd: dto.periodEnd ?? '',
    status: dto.status ?? '',
    processedAt: optional(dto.processedAt),
    transactionId: dto.transactionId || undefined,
    failureReason: dto.failureReason || undefined,
    createdAt: dto.createdAt ?? '',
  }
}

export function toPartnerReferral(dto: PartnerReferralDto): PartnerReferral {
  return {
    id: dto.id,
    referredUser: optional(dto.referredUser?.email),
    referredName: fullName(dto.referredUser),
    partner: dto.partner?.user?.email || dto.partner?.companyName || undefined,
    code: dto.referralLink?.code || dto.partner?.referralCode || undefined,
    kycLevel: dto.referredUser?.kycLevel ?? 0,
    status: dto.status ?? '',
    registeredAt: dto.registeredAt || undefined,
    firstDepositAt: optional(dto.firstDepositAt),
    firstTradeAt: optional(dto.firstTradeAt),
    endedAt: optional(dto.endedAt),
  }
}

export function toPartnerTier(dto: TierDto): PartnerTier {
  return {
    id: dto.id,
    name: dto.name ?? '',
    level: dto.level ?? 0,
    commissionRate: dto.commissionRate ?? 0,
    minActiveClients: dto.minActiveClients ?? 0,
    minVolume: { raw: dto.minVolume ?? 0, currency: USD },
    maxVolume:
      dto.maxVolume === null || dto.maxVolume === undefined
        ? undefined
        : { raw: dto.maxVolume, currency: USD },
    isDefault: dto.isDefault ?? false,
  }
}

export function toPartnerAnalyticsSummary(
  dto: PartnerAnalyticsSummaryDto,
): PartnerAnalyticsSummary {
  return {
    totalPartners: dto.totalPartners ?? 0,
    activePartners: dto.activePartners ?? 0,
    totalApplications: dto.totalApplications ?? 0,
    pendingApplications: dto.pendingApplications ?? 0,
    totalCommissions: { raw: dto.totalCommissions ?? 0, currency: USD },
    totalPayouts: dto.totalPayouts ?? 0,
    pendingPayouts: dto.pendingPayouts ?? 0,
  }
}

export function toReferralFunnel(dto: Partial<ReferralFunnel>): ReferralFunnel {
  return {
    clicks: dto.clicks ?? 0,
    registrations: dto.registrations ?? 0,
    deposits: dto.deposits ?? 0,
    traders: dto.traders ?? 0,
  }
}

export type { TierDto as PartnerTierDto }
