import { clients } from '@/core/network/clients'
import { unwrapObject, type PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toAdminActivity,
  toOperationAccountRow,
  type OperationAccountRowDto,
} from './admin-activity-dto'
import type { OperationAccountRow } from './admin-activity-model'

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

  /** Вэбийн operation дансны дэлгэрэнгүй хуудас. apiKey/secretKey уншихгүй. */
  async operationAccount(subAccountId: string): Promise<OperationAccountRow> {
    const response = await clients.backoffice.get(
      `/users/operation-accounts/detail/${subAccountId}`,
    )
    return toOperationAccountRow(
      unwrapObject<OperationAccountRowDto>(response.data, 'operation-account'),
    )
  },
}
