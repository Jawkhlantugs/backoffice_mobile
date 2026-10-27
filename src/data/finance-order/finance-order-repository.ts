import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import { toFinanceOrder, type FinanceOrderDto } from './finance-order-dto'
import type { FinanceOrder, OrderMarket } from './finance-order-model'

/**
 * Endpoint: `order-usdt.service.ts` / `order-mnt.service.ts` — хоёулаа
 * `{finance}/order-{market}/list`. Cursor pagination (`lastEvaluatedKey`).
 */

export type OrderListParams = {
  market: OrderMarket
  limit: number
  status?: string
  uid?: string
  symbol?: string
  orderId?: string
  start_day?: string
  end_day?: string
  lastEvaluatedKey?: string
}

/**
 * Вэбийн `toListRequest`: хоёр өдөр хоёулаа байвал `new Date(day).getTime()`
 * (UTC шөнө дунд). Дуусах өдрийг ч шөнө дундаар — вэбтэй ижил дүн гаргана.
 */
function timeRange(start_day?: string, end_day?: string) {
  const start = start_day ? Date.parse(start_day) : NaN
  const end = end_day ? Date.parse(end_day) : NaN
  if (Number.isNaN(start) || Number.isNaN(end)) return {}
  return { startTime: start, endTime: end }
}

export const financeOrderRepository = {
  async list(params: OrderListParams): Promise<ListPage<FinanceOrder>> {
    const response = await clients.finance.post(
      `/order-${params.market}/list`,
      {
        limit: params.limit,
        ...(params.status ? { status: params.status } : {}),
        ...(params.uid ? { uid: params.uid } : {}),
        ...(params.symbol ? { symbol: params.symbol } : {}),
        ...(params.orderId ? { orderId: params.orderId } : {}),
        ...timeRange(params.start_day, params.end_day),
        ...(params.lastEvaluatedKey
          ? { lastEvaluatedKey: params.lastEvaluatedKey }
          : {}),
      },
    )

    const page = unwrapList<FinanceOrderDto>(
      response.data,
      `order-${params.market}`,
    )
    return { ...page, items: page.items.map(toFinanceOrder) }
  },
}
