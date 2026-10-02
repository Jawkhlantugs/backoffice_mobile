import { clients } from '@/core/network/clients'
import { unwrap } from '@/core/network/envelope'
import type { DayRange } from '@/lib/date-range'

import {
  toDashboardSummary,
  toRevenueSource,
  type DashboardSummaryDto,
  type RevenueSourceDto,
} from './dashboard-dto'
import type { DashboardSummary, RevenueSource } from './dashboard-model'

/** Вэб `startDate/endDate` (YYYY-MM-DD) явуулдаг. */
const body = (range: DayRange) => ({
  startDate: range.start_day,
  endDate: range.end_day,
})

/** Endpoint: `dashboard.service.ts` — `POST {backoffice}/dashboard/overview/*`. */
export const dashboardRepository = {
  async summary(range: DayRange): Promise<DashboardSummary | null> {
    const response = await clients.backoffice.post(
      '/dashboard/overview/summary',
      body(range),
    )
    const data = unwrap<DashboardSummaryDto | null>(response.data)
    return data ? toDashboardSummary(data) : null
  },

  async revenueSources(range: DayRange): Promise<RevenueSource[]> {
    const response = await clients.backoffice.post(
      '/dashboard/overview/revenue-sources',
      body(range),
    )
    const data = unwrap<{ revenueBySource?: RevenueSourceDto[] } | null>(
      response.data,
    )
    return (data?.revenueBySource ?? []).map(toRevenueSource)
  },
}
