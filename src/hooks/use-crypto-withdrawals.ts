import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cryptoWithdrawalRepository } from '@/data/crypto-withdrawal/crypto-withdrawal-repository'
import { withDefaultRange, type ListFilters } from '@/lib/list-filters'

import { usePagedList } from './use-paged-list'

export function useCryptoWithdrawals(
  options: { search?: string; status?: string; filters?: ListFilters } = {},
) {
  return usePagedList(
    'crypto-withdrawals',
    (params) => cryptoWithdrawalRepository.list(params),
    {
      search: options.search,
      filters: {
        status: options.status,
        ...withDefaultRange(options.filters ?? {}),
      },
    },
  )
}

export function useCryptoWithdrawAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      historyId,
      action,
    }: {
      historyId: string
      action: 'APPROVE' | 'REFUND'
    }) => cryptoWithdrawalRepository.action(historyId, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['crypto-withdrawals'] })
    },
  })
}
