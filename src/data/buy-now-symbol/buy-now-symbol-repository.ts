import { clients } from '@/core/network/clients'
import type { CursorParams } from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import { toBuyNowSymbol } from './buy-now-symbol-dto'

/** Endpoint: `buy-now.service.ts` — `POST {finance}/buynow/symbol/list`. */
export const buyNowSymbolRepository = {
  list: (params: CursorParams) =>
    fetchCursorList(
      clients.finance,
      '/buynow/symbol/list',
      params,
      { limit: params.limit, symbol: params.query },
      toBuyNowSymbol,
    ),
}
