import { clients } from '@/core/network/clients'
import type { CursorParams } from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import { toMatchResult } from './match-engine-dto'
import type { MatchMarket } from './match-engine-model'

/** Вэбийн `TABLE_CONFIG.DEFAULT_PAIR`. */
const PAIRS: Record<MatchMarket, string> = {
  'ihc-mnt': 'IHC_MNT',
  'usdt-mnt': 'USDT_MNT',
}

/** Endpoint: `match-engine.service.ts` — `{finance}/match-engine/{market}/list`. */
export const matchEngineRepository = {
  list: (params: CursorParams & { market: MatchMarket; isCancel?: string }) =>
    fetchCursorList(
      clients.finance,
      `/match-engine/${params.market}/list`,
      params,
      {
        limit: params.limit,
        pair: PAIRS[params.market],
        is_cancel: params.isCancel,
      },
      toMatchResult,
    ),
}
