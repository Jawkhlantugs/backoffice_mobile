import { futuresAccountRepository } from '@/data/futures-account/futures-account-repository'

import { usePagedList } from './use-paged-list'

export const useFuturesAccounts = (search: string) =>
  usePagedList('futures-accounts', futuresAccountRepository.users, { search })
export const useFuturesClosedPositions = (search: string) =>
  usePagedList(
    'futures-closed-positions',
    futuresAccountRepository.closedPositions,
    { search },
  )
