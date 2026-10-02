import { clients } from '@/core/network/clients'
import { unwrap, type PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toPartner,
  toPartnerAnalyticsSummary,
  toPartnerApplication,
  toPartnerCommission,
  toPartnerPayout,
  toPartnerReferral,
  toPartnerTier,
  toReferralFunnel,
  type PartnerAnalyticsSummaryDto,
  type PartnerDto,
  type PartnerTierDto,
} from './partner-dto'
import type {
  Partner,
  PartnerAnalyticsSummary,
  PartnerStatus,
  PartnerTier,
  ReferralFunnel,
} from './partner-model'

type StatusParams = PageParams & { status?: string }

/**
 * Endpoint: `services/api/partner/*.service.ts` — `{partner}` нь тусдаа host
 * (`EXPO_PUBLIC_PARTNER_API_URL`). Хариу нь `BaseResponse<{items,total}>`.
 */
export const partnerRepository = {
  partners: (params: StatusParams) =>
    fetchList(clients.partner, '/partners/list', params, toPartner),
  applications: (params: StatusParams) =>
    fetchList(
      clients.partner,
      '/applications/list',
      params,
      toPartnerApplication,
    ),
  commissions: (params: StatusParams) =>
    fetchList(
      clients.partner,
      '/commissions/list',
      params,
      toPartnerCommission,
    ),
  payouts: (params: StatusParams) =>
    fetchList(clients.partner, '/payouts/list', params, toPartnerPayout),
  referrals: (params: StatusParams) =>
    fetchList(clients.partner, '/referrals/list', params, toPartnerReferral),

  async tiers(): Promise<PartnerTier[]> {
    const response = await clients.partner.get('/config/tiers')
    const body = unwrap<PartnerTierDto[] | null>(response.data) ?? []
    return body.map(toPartnerTier).sort((a, b) => a.level - b.level)
  },

  async summary(): Promise<PartnerAnalyticsSummary | null> {
    const response = await clients.partner.post('/analytics/summary', {})
    const body = unwrap<PartnerAnalyticsSummaryDto | null>(response.data)
    return body ? toPartnerAnalyticsSummary(body) : null
  },

  async referralFunnel(): Promise<ReferralFunnel | null> {
    const response = await clients.partner.post(
      '/analytics/referral-funnel',
      {},
    )
    const body = unwrap<Partial<ReferralFunnel> | null>(response.data)
    return body ? toReferralFunnel(body) : null
  },

  /** Вэб `pageSize: 10` — хуудаслалтгүй `Partner[]` буцаана. */
  async topPartners(): Promise<Partner[]> {
    const response = await clients.partner.post('/analytics/top-partners', {
      pageSize: 10,
    })
    const body = unwrap<PartnerDto[] | null>(response.data) ?? []
    return body.map(toPartner)
  },

  /** Partner эрх өөрчилнө — дуудагч ConfirmSheet-ээр хамгаална (§1.5). */
  async updateStatus(id: string, status: PartnerStatus): Promise<void> {
    await clients.partner.put(`/partners/${id}/status`, { status })
  },

  async approveApplication(id: string): Promise<void> {
    await clients.partner.post(`/applications/${id}/approve`)
  },

  async rejectApplication(id: string, rejectionReason: string): Promise<void> {
    await clients.partner.post(`/applications/${id}/reject`, {
      rejectionReason,
    })
  },

  /** Мөнгө хөдөлгөнө. Вэб idempotency key явуулдаггүй (§1.7). */
  async approvePayout(id: string): Promise<void> {
    await clients.partner.post(`/payouts/${id}/approve`)
  },

  async rejectPayout(id: string, failureReason: string): Promise<void> {
    await clients.partner.post(`/payouts/${id}/reject`, { failureReason })
  },
}
