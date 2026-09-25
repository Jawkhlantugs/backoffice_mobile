import { balanceSnapshotRepository } from '@/data/balance-snapshot/balance-snapshot-repository'

import { useCursorList } from './use-cursor-list'

export const useBalanceSnapshots = (search: string) =>
  useCursorList('balance-snapshots', balanceSnapshotRepository.list, { search })
