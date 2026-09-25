import { adminActivityRepository } from '@/data/admin-activity/admin-activity-repository'

import { usePagedList } from './use-paged-list'

export const useAdminActivities = (search: string) =>
  usePagedList('admin-activities', adminActivityRepository.activities, {
    search,
  })
export const useOperationAccountRows = (search: string) =>
  usePagedList(
    'operation-account-rows',
    adminActivityRepository.operationAccounts,
    { search },
  )
