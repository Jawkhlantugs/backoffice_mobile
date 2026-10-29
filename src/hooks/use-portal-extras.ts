import { useQuery } from '@tanstack/react-query'

import type { CursorParams } from '@/core/network/envelope'
import { adminActivityRepository } from '@/data/admin-activity/admin-activity-repository'
import { assetRecoveryRepository } from '@/data/asset-recovery/asset-recovery-repository'
import { buyNowSymbolRepository } from '@/data/buy-now-symbol/buy-now-symbol-repository'
import type { JobApplicationStatus } from '@/data/career/career-model'
import { careerRepository } from '@/data/career/career-repository'
import { complianceMonitorRepository } from '@/data/compliance-monitor/compliance-monitor-repository'
import { convertLimitRepository } from '@/data/convert-limit/convert-limit-repository'
import { crystalRepository } from '@/data/crystal/crystal-repository'
import { withUserSearch } from '@/data/exchange-user/user-search'
import { jumioBackupRepository } from '@/data/jumio-backup/jumio-backup-repository'
import {
  isMissingTxin,
  type MatchMarket,
  type MissingTxin,
} from '@/data/match-engine/match-engine-model'
import {
  matchEngineRepository,
  type MatchListFilters,
} from '@/data/match-engine/match-engine-repository'
import { operationAccountBalanceRepository } from '@/data/operation-account/operation-account-balance-repository'
import { stakeRepository } from '@/data/stake/stake-repository'
import { withDefaultRange, type ListFilters } from '@/lib/list-filters'

import { useCursorList } from './use-cursor-list'
import { useInvalidatingMutation } from './use-invalidating-mutation'
import { usePagedList } from './use-paged-list'

/**
 * `missingTxin` нь backend-д байхгүй тул ачаалсан мөрөөс шүүнэ — `scanned` нь
 * хэдэн мөрөөс хайсныг, нийт тоо (`total`) нь шүүгээгүй дүн тул нуугдана.
 */
export function useMatchResults(
  market: MatchMarket,
  options: {
    isCancel?: string
    filters?: ListFilters
    missingTxin?: MissingTxin
  } = {},
) {
  const list = useCursorList(
    `match-${market}`,
    (params: CursorParams & MatchListFilters) =>
      matchEngineRepository.list({ ...params, market }),
    {
      filters: {
        isCancel: options.isCancel,
        ...withDefaultRange(options.filters ?? {}),
      },
    },
  )
  const side = options.missingTxin
  if (!side) return { ...list, scanned: undefined }
  return {
    ...list,
    items: list.items.filter((item) => isMissingTxin(item, side)),
    total: undefined,
    scanned: list.items.length,
  }
}

export const useConvertLimitOrders = (status: string) =>
  useCursorList('convert-limit', convertLimitRepository.list, {
    filters: { status },
  })
export const useAcceptConvertLimit = () =>
  useInvalidatingMutation('convert-limit', (id: string) =>
    convertLimitRepository.accept(id),
  )
export const useCompleteConvertLimit = () =>
  useInvalidatingMutation('convert-limit', (id: string) =>
    convertLimitRepository.complete(id),
  )
export const useReopenConvertLimit = () =>
  useInvalidatingMutation('convert-limit', (id: string) =>
    convertLimitRepository.reopen(id),
  )
export const useRejectConvertLimit = () =>
  useInvalidatingMutation(
    'convert-limit',
    (vars: { id: string; reason: string }) =>
      convertLimitRepository.reject(vars.id, vars.reason),
  )

export const useAssetRecoveries = (search: string, status?: string) =>
  useCursorList('asset-recovery', assetRecoveryRepository.list, {
    search,
    filters: { status },
  })
export const useApproveAssetRecovery = () =>
  useInvalidatingMutation('asset-recovery', (id: string) =>
    assetRecoveryRepository.approve(id),
  )

export const useBuyNowSymbols = (search: string) =>
  useCursorList('buynow-symbols', buyNowSymbolRepository.list, { search })

export const useMonitorUsers = (search: string, status?: string) =>
  useCursorList(
    'compliance-monitor',
    withUserSearch(complianceMonitorRepository.list),
    {
      search,
      filters: { status },
    },
  )

export const useStakeStatistics = () =>
  useQuery({
    queryKey: ['stake-statistics'],
    queryFn: stakeRepository.statistics,
  })

export const useJobPostings = (status: string) =>
  useCursorList('job-postings', careerRepository.postings, {
    filters: { status },
  })
export const useJobApplications = (status: string) =>
  useCursorList('job-applications', careerRepository.applications, {
    filters: { status },
  })
export const useUpdateJobApplication = () =>
  useInvalidatingMutation(
    'job-applications',
    (vars: { id: string; status: JobApplicationStatus }) =>
      careerRepository.updateApplicationStatus(vars.id, vars.status),
  )

export const useCrystalTransfers = (alertGrade?: string) =>
  usePagedList('crystal-transfers', crystalRepository.transfers, {
    filters: { alertGrade },
  })
export const useCrystalCustomers = () =>
  usePagedList('crystal-customers', crystalRepository.customers)

export const useJumioBackups = (search: string) =>
  usePagedList('jumio-backup', jumioBackupRepository.list, { search })

export const useOperationAccount = (subAccountId: string) =>
  useQuery({
    queryKey: ['operation-account', subAccountId],
    queryFn: () => adminActivityRepository.operationAccount(subAccountId),
    enabled: subAccountId.length > 0,
  })

export const useOperationAccountBalance = (subAccountId: string) =>
  useQuery({
    queryKey: ['operation-account-balance', subAccountId],
    queryFn: () => operationAccountBalanceRepository.get(subAccountId),
    enabled: subAccountId.length > 0,
  })
