import { useMutation, useQueryClient } from '@tanstack/react-query'

import { bankWithdrawalRepository } from '@/data/bank-withdrawal/bank-withdrawal-repository'

import { usePagedList } from './use-paged-list'

export function useBankWithdrawals(options: { search?: string } = {}) {
  return usePagedList(
    'bank-withdrawals',
    (params) => bankWithdrawalRepository.list(params),
    { search: options.search },
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
