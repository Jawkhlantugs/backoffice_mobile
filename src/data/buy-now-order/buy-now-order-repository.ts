import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import { toBuyNowOrder, type BuyNowOrderDto } from './buy-now-order-dto'
import type { BuyNowOrder } from './buy-now-order-model'

/** Endpoint: `buy-now.service.ts` — `POST {backoffice}/buynow/orders/list`. */
export type BuyNowOrderListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
  cryptoCurrency?: string
  orderId?: string
  start_day?: string
  end_day?: string
}

export const buyNowOrderRepository = {
  async list(params: BuyNowOrderListParams): Promise<ListPage<BuyNowOrder>> {
    const response = await clients.backoffice.post('/buynow/orders/list', {
      current: params.current,
      pageSize: params.pageSize,
      ...(params.query ? { query: params.query } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.cryptoCurrency
        ? { cryptoCurrency: params.cryptoCurrency }
        : {}),
      ...(params.orderId ? { orderId: params.orderId } : {}),
      ...(params.start_day && params.end_day
        ? { sortDate: { start_day: params.start_day, end_day: params.end_day } }
        : {}),
    })

    const page = unwrapList<BuyNowOrderDto>(response.data, 'buynow-orders')
    return { ...page, items: page.items.map(toBuyNowOrder) }
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async retry(orderId: string): Promise<void> {
    await clients.finance.post('/buynow/retry', { orderId })
  },
}
