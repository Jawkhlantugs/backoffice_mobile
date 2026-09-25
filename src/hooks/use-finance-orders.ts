import { useQuery } from '@tanstack/react-query'

import { financeOrderRepository } from '@/data/finance-order/finance-order-repository'
import type { OrderMarket } from '@/data/finance-order/finance-order-model'

const LIMIT = 20

export function useFinanceOrders(
  market: OrderMarket,
  options: { search?: string } = {},
) {
  const uid = options.search?.trim() || undefined

  return useQuery({
    queryKey: ['finance-orders', market, uid ?? 'all'],
    queryFn: () => financeOrderRepository.list({ market, limit: LIMIT, uid }),
  })
}
