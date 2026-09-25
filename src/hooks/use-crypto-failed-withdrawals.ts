import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cryptoFailedWithdrawalRepository } from '@/data/crypto-failed-withdrawal/crypto-failed-withdrawal-repository'

import { usePagedList } from './use-paged-list'

export function useCryptoFailedWithdrawals(options: { search?: string } = {}) {
  return usePagedList(
    'crypto-failed-withdrawals',
    (params) => cryptoFailedWithdrawalRepository.list(params),
    { search: options.search },
  )
}

export function useManualRefundFailedWithdrawal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      cryptoFailedWithdrawalRepository.manualRefund(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['crypto-failed-withdrawals'],
      })
    },
  })
}
