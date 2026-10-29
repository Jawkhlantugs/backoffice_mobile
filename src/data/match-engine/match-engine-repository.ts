import { clients } from '@/core/network/clients'
import type { CursorParams } from '@/core/network/envelope'
import { dayTimeRange } from '@/data/shared/day-time-range'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import { toMatchResult } from './match-engine-dto'
import type { MatchMarket } from './match-engine-model'

/** Вэбийн `TABLE_CONFIG.DEFAULT_PAIR`. */
const PAIRS: Record<MatchMarket, string> = {
  'ihc-mnt': 'IHC_MNT',
  'usdt-mnt': 'USDT_MNT',
}

/** Вэбийн `MATCH_ENGINE_FILTER_FIELDS` — түлхүүр нь backend-ийн нэрээрээ. */
export type MatchListFilters = {
  isCancel?: string
  maker_order_id?: string
  taker_order_id?: string
  txinID?: string
  maker_user_id?: string
  taker_user_id?: string
  hariult_amount?: string
  start_day?: string
  end_day?: string
}

/** Endpoint: `match-engine.service.ts` — `{finance}/match-engine/{market}/list`. */
export const matchEngineRepository = {
  list: (params: CursorParams & MatchListFilters & { market: MatchMarket }) =>
    fetchCursorList(
      clients.finance,
      `/match-engine/${params.market}/list`,
      params,
      {
        limit: params.limit,
        pair: PAIRS[params.market],
        is_cancel: params.isCancel,
        maker_order_id: params.maker_order_id,
        taker_order_id: params.taker_order_id,
        txinID: params.txinID,
        maker_user_id: params.maker_user_id,
        taker_user_id: params.taker_user_id,
        hariult_amount: params.hariult_amount,
        ...dayTimeRange(params.start_day, params.end_day),
      },
      toMatchResult,
    ),
}
