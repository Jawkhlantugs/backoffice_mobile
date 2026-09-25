import { bankExchangeTxnTaskRepository } from '@/data/bank-exchange-txn-task/bank-exchange-txn-task-repository'

import { usePagedList } from './use-paged-list'

export function useBankExchangeTxnTasks(options: { search?: string } = {}) {
  return usePagedList(
    'bank-exchange-txn-task',
    (params) => bankExchangeTxnTaskRepository.list(params),
    { search: options.search },
  )
}
