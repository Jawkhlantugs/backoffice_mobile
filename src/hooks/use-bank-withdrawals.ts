import { useMutation, useQueryClient } from '@tanstack/react-query'

import { bankWithdrawalRepository } from '@/data/bank-withdrawal/bank-withdrawal-repository'
import type { AmountCondition } from '@/data/shared/amount-filter'
import { recentRange, type RangePeriod } from '@/lib/date-range'

import { usePagedList } from './use-paged-list'

/** Шүүлтүүрийн хавтангийн утга — вэбийн filter panel-тай ижил талбарууд. */
export type BankWithdrawalFilters = {
  id?: string
  txnId?: string
  accountNumber?: string
  totalAmount?: string
  condition?: AmountCondition
  period?: RangePeriod
}

export function useBankWithdrawals(
  options: {
    search?: string
    status?: string
    filters?: BankWithdrawalFilters
  } = {},
) {
  const { period, ...filters } = options.filters ?? {}

  return usePagedList(
    'bank-withdrawals',
    (params) => bankWithdrawalRepository.list(params),
    {
      search: options.search,
      filters: {
        status: options.status,
        ...filters,
        ...(period ? recentRange(period) : {}),
      },
    },
  )
}

export function useMarkBankWithdrawTransferred() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => bankWithdrawalRepository.markTransferred(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bank-withdrawals'] })
    },
  })
}
