import { bankDepositRepository } from '@/data/bank-deposit/bank-deposit-repository'

import { usePagedList } from './use-paged-list'

export function useBankDeposits(options: { search?: string } = {}) {
  return usePagedList(
    'bank-deposits',
    (params) => bankDepositRepository.list(params),
    { search: options.search },
  )
}
