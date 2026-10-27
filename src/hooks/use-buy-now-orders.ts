import { useMutation, useQueryClient } from '@tanstack/react-query'

import { buyNowOrderRepository } from '@/data/buy-now-order/buy-now-order-repository'
import { withDefaultRange, type ListFilters } from '@/lib/list-filters'

import { usePagedList } from './use-paged-list'

export function useBuyNowOrders(
  options: { search?: string; status?: string; filters?: ListFilters } = {},
) {
  return usePagedList(
    'buy-now-orders',
    (params) => buyNowOrderRepository.list(params),
    {
      search: options.search,
      filters: {
        status: options.status,
        ...withDefaultRange(options.filters ?? {}),
      },
    },
  )
}

export function useRetryBuyNowOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => buyNowOrderRepository.retry(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['buy-now-orders'] })
    },
  })
}
