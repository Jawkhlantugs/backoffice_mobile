import { clients } from '@/core/network/clients'
import { unwrapList } from '@/core/network/envelope'

import { uniqueCoins, type CryptoCoinDto } from './crypto-coin-dto'
import type { CryptoCoin } from './crypto-coin-model'

/** Вэб бүх coin-ыг нэг дор татдаг (`pageSize: 1000`) — сонголтын жагсаалт. */
const ALL_COINS_PAGE_SIZE = 1000

/** Endpoint: `crypto.service.ts` — `POST {backoffice}/crypto/coins/list`. */
export const cryptoCoinRepository = {
  async listAll(): Promise<CryptoCoin[]> {
    const response = await clients.backoffice.post('/crypto/coins/list', {
      current: 1,
      pageSize: ALL_COINS_PAGE_SIZE,
    })
    const page = unwrapList<CryptoCoinDto>(response.data, 'crypto-coins')
    return uniqueCoins(page.items)
  },
}
