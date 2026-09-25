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
  lastEvaluatedKey?: string
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
