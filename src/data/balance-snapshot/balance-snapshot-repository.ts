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
const DAYS_FALLBACK = 31

async function fetchSnapshots(body: Record<string, unknown>) {
  const response = await clients.finance.post('/user/balance-snapshot', body)
  const outer = unwrap<SnapshotData | { data?: SnapshotData }>(response.data)
  return ('data' in outer && outer.data ? outer.data : outer) as SnapshotData
}

export const balanceSnapshotRepository = {
  async list(params: CursorParams): Promise<ListPage<BalanceSnapshot>> {
    const key = decodeCursor(params.cursor)
    const data = await fetchSnapshots({
      limit: params.limit,
      ...(key === undefined ? {} : { lastEvaluatedKey: key }),
      // Вэбийн шүүлтүүр subAccountId-аар — хайлтын талбар үүнийг бөглөнө.
      ...(params.query ? { subAccountId: params.query } : {}),
    })
    return {
      items: (data.list ?? []).map(toBalanceSnapshot),
      total: data.total,
      lastEvaluatedKey: encodeCursor(data.lastEvaluatedKey),
    }
  },

  /**
   * Нэг хэрэглэгчийн тухайн өдрийн зураг. Вэбийн user detail `uid`-аар,
   * нийт жагсаалт `date`-ээр шүүдэг — хоёуланг нь илгээнэ. Тэр өдөр зураг
   * аваагүй бол `null`. Backend `date`-ийг үл тоовол сүүлийн сарын
   * зургуудаас өдрөөр нь олно.
   */
  async forUserOnDate(
    uid: string,
    date: string,
  ): Promise<BalanceSnapshot | null> {
    const data = await fetchSnapshots({ uid, date, limit: DAYS_FALLBACK })
    const match = (data.list ?? []).find((item) => item.date === date)
    return match ? toBalanceSnapshot(match) : null
  },
}
