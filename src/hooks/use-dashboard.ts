import { useQuery } from '@tanstack/react-query'

import { dashboardRepository } from '@/data/dashboard/dashboard-repository'
import { recentRange, type RangePeriod } from '@/lib/date-range'

const DASHBOARD_STALE_MS = 60_000

export function useDashboard(period: RangePeriod) {
  const range = recentRange(period)
  const summary = useQuery({
    queryKey: ['dashboard', 'summary', range],
    queryFn: () => dashboardRepository.summary(range),
    staleTime: DASHBOARD_STALE_MS,
  })
  const revenue = useQuery({
    queryKey: ['dashboard', 'revenue-sources', range],
    queryFn: () => dashboardRepository.revenueSources(range),
    staleTime: DASHBOARD_STALE_MS,
  })
  return { summary, revenue }
}
