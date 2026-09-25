import { clients } from '@/core/network/clients'
import {
  unwrap,
  type CursorParams,
  type ListPage,
} from '@/core/network/envelope'
import { decodeCursor, encodeCursor } from '@/data/shared/cursor'

import {
  toBalanceSnapshot,
  type BalanceSnapshotDto,
} from './balance-snapshot-dto'
import type { BalanceSnapshot } from './balance-snapshot-model'

type SnapshotData = {
  list?: BalanceSnapshotDto[]
  total?: number
  lastEvaluatedKey?: unknown
}

/**
 * Endpoint: `POST {finance}/user/balance-snapshot`. Вэб `response.data.data.data`
 * гэж уншдаг — давхар `data` дугтуй (`user/balance`-тай ижил).
 */
export const balanceSnapshotRepository = {
  async list(params: CursorParams): Promise<ListPage<BalanceSnapshot>> {
    const key = decodeCursor(params.cursor)
    const response = await clients.finance.post('/user/balance-snapshot', {
      limit: params.limit,
      ...(key === undefined ? {} : { lastEvaluatedKey: key }),
      // Вэбийн шүүлтүүр subAccountId-аар — хайлтын талбар үүнийг бөглөнө.
      ...(params.query ? { subAccountId: params.query } : {}),
    })
    const outer = unwrap<SnapshotData | { data?: SnapshotData }>(response.data)
    const data = (
      'data' in outer && outer.data ? outer.data : outer
    ) as SnapshotData
    return {
      items: (data.list ?? []).map(toBalanceSnapshot),
      total: data.total,
      lastEvaluatedKey: encodeCursor(data.lastEvaluatedKey),
    }
  },
}
