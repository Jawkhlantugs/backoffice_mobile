import { useQuery } from '@tanstack/react-query'

import { balanceSnapshotRepository } from '@/data/balance-snapshot/balance-snapshot-repository'
import { withUserSearch } from '@/data/exchange-user/user-search'

import { useCursorList } from './use-cursor-list'

export const useBalanceSnapshots = (search: string) =>
  useCursorList(
    'balance-snapshots',
    withUserSearch(balanceSnapshotRepository.list, 'subAccountId'),
    { search },
  )

export function useUserSnapshot(uid: string, date: string | null) {
  return useQuery({
    queryKey: ['balance-snapshots', 'user', uid, date],
    queryFn: () => balanceSnapshotRepository.forUserOnDate(uid, date ?? ''),
    enabled: uid.length > 0 && date !== null,
  })
}
