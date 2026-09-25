import { clients } from '@/core/network/clients'
import { unwrap } from '@/core/network/envelope'

import {
  toFuturesMasterRisk,
  toFuturesOpenOrder,
  type FuturesMasterRiskDto,
  type FuturesOpenOrderDto,
} from './futures-risk-dto'
import type { FuturesMasterRisk, FuturesOpenOrder } from './futures-risk-model'

/**
 * Endpoint: `futures-transfer.service.ts` — REST snapshot, Binance live
 * socket огт ашиглахгүй (`MOBILE_SCOPE_RESEARCH.md` §2.8, mobile дээр
 * зөвлөхгүй гэсэн хэсэг).
 */
export const futuresRiskRepository = {
  async masterRisk(): Promise<FuturesMasterRisk> {
    const response = await clients.finance.get('/futures/master-risk')
    return toFuturesMasterRisk(unwrap<FuturesMasterRiskDto>(response.data))
  },

  async openOrders(): Promise<FuturesOpenOrder[]> {
    const response = await clients.finance.get('/futures/open-orders')
    const body = unwrap<{ orders?: FuturesOpenOrderDto[] }>(response.data)
    return (body.orders ?? []).map(toFuturesOpenOrder)
  },
}
