import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import { toAdminActivity, toOperationAccountRow } from './admin-activity-dto'

/** Endpoint: `users.service.ts` — activity log, operation accounts. */
export const adminActivityRepository = {
  activities: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/admin/activity-logs/list',
      params,
      toAdminActivity,
    ),
  operationAccounts: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/users/operation-accounts/list',
      params,
      toOperationAccountRow,
    ),
}
