import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { futuresTransferRepository } from '@/data/futures-transfer/futures-transfer-repository'
import type { FuturesTransferStatus } from '@/data/futures-transfer/futures-transfer-model'

const QUERY_KEY = ['futures-transfer-requests'] as const

export function useFuturesTransferRequests(status?: FuturesTransferStatus) {
  return useQuery({
    queryKey: [...QUERY_KEY, status ?? 'all'],
    queryFn: () => futuresTransferRepository.list({ status }),
  })
}

export function useApproveFuturesTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ txnId, note }: { txnId: string; note?: string }) =>
      futuresTransferRepository.approve(txnId, note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useRejectFuturesTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ txnId, reason }: { txnId: string; reason: string }) =>
      futuresTransferRepository.reject(txnId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
