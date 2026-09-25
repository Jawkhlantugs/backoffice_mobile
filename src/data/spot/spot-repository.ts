import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toSpotCommission,
  toSpotFill,
  toSpotOrder,
  toSpotSymbol,
  toSpotTrade,
} from './spot-dto'

/** Endpoint: `spot.service.ts` — бүгд `POST {backoffice}/spot/…/list`. */
export const spotRepository = {
  orders: (params: PageParams) =>
    fetchList(clients.backoffice, '/spot/orders/list', params, toSpotOrder),
  fills: (params: PageParams) =>
    fetchList(clients.backoffice, '/spot/history/list', params, toSpotFill),
  trades: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/spot/trade-history/list',
      params,
      toSpotTrade,
    ),
  commissions: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/spot/commissions/list',
      params,
      toSpotCommission,
    ),
  symbols: (params: PageParams) =>
    fetchList(clients.backoffice, '/spot/symbols/list', params, toSpotSymbol),
}
