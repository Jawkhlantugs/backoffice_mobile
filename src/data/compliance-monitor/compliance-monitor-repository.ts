import { clients } from '@/core/network/clients'
import type { CursorParams } from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import { toMonitorUser } from './compliance-monitor-dto'

/**
 * Endpoint: `compliance.service.ts` —
 * `POST {compliance}/compliance-monitoring/user/list`. Хайлт нь userId.
 */
export const complianceMonitorRepository = {
  list: (params: CursorParams & { status?: string }) =>
    fetchCursorList(
      clients.compliance,
      '/compliance-monitoring/user/list',
      params,
      { limit: params.limit, userId: params.query, status: params.status },
      toMonitorUser,
    ),
}
