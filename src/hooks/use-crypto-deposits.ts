import { cryptoDepositRepository } from '@/data/crypto-deposit/crypto-deposit-repository'

import { usePagedList } from './use-paged-list'

export function useCryptoDeposits(
  isOperation: boolean,
  options: { search?: string } = {},
) {
  return usePagedList(
    isOperation ? 'crypto-deposits-operations' : 'crypto-deposits-users',
    (params) => cryptoDepositRepository.list({ ...params, isOperation }),
    { search: options.search },
  )
}
