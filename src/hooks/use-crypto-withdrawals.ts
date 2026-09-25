import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cryptoWithdrawalRepository } from '@/data/crypto-withdrawal/crypto-withdrawal-repository'

import { usePagedList } from './use-paged-list'

export function useCryptoWithdrawals(options: { search?: string } = {}) {
  return usePagedList(
    'crypto-withdrawals',
    (params) => cryptoWithdrawalRepository.list(params),
    { search: options.search },
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
