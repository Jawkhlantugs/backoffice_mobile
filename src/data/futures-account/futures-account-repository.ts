import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toFuturesAccount,
  toFuturesClosedPosition,
} from './futures-account-dto'

/** Endpoint: `futures.service.ts` — `POST {backoffice}/futures/…/list`. */
export const futuresAccountRepository = {
  users: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/futures/users/list',
      params,
      toFuturesAccount,
    ),
  closedPositions: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/futures/closed-positions/list',
      params,
      toFuturesClosedPosition,
    ),
}
