import { useQuery } from '@tanstack/react-query'

import { resolveUserSearch } from '@/data/exchange-user/user-search'
import { financeOrderRepository } from '@/data/finance-order/finance-order-repository'
import {
  ORDER_SYMBOLS,
  orderLimit,
  type OrderMarket,
} from '@/data/finance-order/finance-order-model'
import type { ListFilters } from '@/lib/list-filters'

import { useDebouncedValue } from './use-debounced-value'

export function useFinanceOrders(
  market: OrderMarket,
  options: { search?: string; status?: string; filters?: ListFilters } = {},
) {
  const uid = useDebouncedValue(options.search?.trim() ?? '') || undefined
  // Orders нь `useFilterParams` ашигладаггүй — огноог өнөөдрөөр нөхөхгүй.
  const { limit, ...filters } = options.filters ?? {}

  return useQuery({
    queryKey: [
      'finance-orders',
      market,
      uid ?? 'all',
      options.status ?? 'all',
      limit,
      filters,
    ],
    queryFn: async () => {
      const resolved = await resolveUserSearch(uid)
      if (resolved === null) return { items: [] }
      return financeOrderRepository.list({
        market,
        limit: orderLimit(limit),
        uid: resolved,
        status: options.status,
        symbol: ORDER_SYMBOLS[market],
        ...filters,
      })
    },
  })
}
