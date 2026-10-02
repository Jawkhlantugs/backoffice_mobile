import { useQuery } from '@tanstack/react-query'

import type { PartnerStatus } from '@/data/partner/partner-model'
import { partnerRepository } from '@/data/partner/partner-repository'

import { useInvalidatingMutation } from './use-invalidating-mutation'
import { usePagedList } from './use-paged-list'

const ANALYTICS_STALE_MS = 60_000

export const usePartners = (search: string, status?: string) =>
  usePagedList('partners', partnerRepository.partners, {
    search,
    filters: { status },
  })
export const usePartnerApplications = (search: string, status?: string) =>
  usePagedList('partner-applications', partnerRepository.applications, {
    search,
    filters: { status },
  })
export const usePartnerCommissions = (search: string, status?: string) =>
  usePagedList('partner-commissions', partnerRepository.commissions, {
    search,
    filters: { status },
  })
export const usePartnerPayouts = (status?: string) =>
  usePagedList('partner-payouts', partnerRepository.payouts, {
    filters: { status },
  })
export const usePartnerReferrals = (search: string, status?: string) =>
  usePagedList('partner-referrals', partnerRepository.referrals, {
    search,
    filters: { status },
  })

export const usePartnerTiers = () =>
  useQuery({ queryKey: ['partner-tiers'], queryFn: partnerRepository.tiers })

export function usePartnerAnalytics() {
  const summary = useQuery({
    queryKey: ['partner-analytics', 'summary'],
    queryFn: partnerRepository.summary,
    staleTime: ANALYTICS_STALE_MS,
  })
  const funnel = useQuery({
    queryKey: ['partner-analytics', 'funnel'],
    queryFn: partnerRepository.referralFunnel,
    staleTime: ANALYTICS_STALE_MS,
  })
  const top = useQuery({
    queryKey: ['partner-analytics', 'top'],
    queryFn: partnerRepository.topPartners,
    staleTime: ANALYTICS_STALE_MS,
  })
  return { summary, funnel, top }
}

export const useUpdatePartnerStatus = () =>
  useInvalidatingMutation(
    'partners',
    (vars: { id: string; status: PartnerStatus }) =>
      partnerRepository.updateStatus(vars.id, vars.status),
  )

export const useApprovePartnerApplication = () =>
  useInvalidatingMutation('partner-applications', (id: string) =>
    partnerRepository.approveApplication(id),
  )

export const useRejectPartnerApplication = () =>
  useInvalidatingMutation(
    'partner-applications',
    (vars: { id: string; reason: string }) =>
      partnerRepository.rejectApplication(vars.id, vars.reason),
  )

export const useApprovePartnerPayout = () =>
  useInvalidatingMutation('partner-payouts', (id: string) =>
    partnerRepository.approvePayout(id),
  )

export const useRejectPartnerPayout = () =>
  useInvalidatingMutation(
    'partner-payouts',
    (vars: { id: string; reason: string }) =>
      partnerRepository.rejectPayout(vars.id, vars.reason),
  )
