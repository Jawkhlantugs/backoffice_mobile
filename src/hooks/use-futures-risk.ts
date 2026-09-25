import { useQuery } from '@tanstack/react-query'

import { futuresRiskRepository } from '@/data/futures-risk/futures-risk-repository'

/** REST polling — live socket ашиглахгүй (§2.8). */
const POLL_INTERVAL_MS = 8_000

export function useFuturesMasterRisk() {
  return useQuery({
    queryKey: ['futures-master-risk'],
    queryFn: () => futuresRiskRepository.masterRisk(),
    refetchInterval: POLL_INTERVAL_MS,
  })
}

export function useFuturesOpenOrders() {
  return useQuery({
    queryKey: ['futures-open-orders'],
    queryFn: () => futuresRiskRepository.openOrders(),
    refetchInterval: POLL_INTERVAL_MS,
  })
}
