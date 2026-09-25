import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import { toCryptoDeposit, type CryptoDepositDto } from './crypto-deposit-dto'
import type { CryptoDeposit } from './crypto-deposit-model'

/**
 * Endpoint: `crypto.service.ts` — хэрэглэгчийн болон үйл ажиллагааны орлого
 * ижил schema, зөвхөн зам (`/users/list` vs `/operations/list`) ялгаатай.
 */
export type CryptoDepositListParams = {
  isOperation: boolean
  current: number
  pageSize: number
  query?: string
  status?: string
  currency?: string
}

export const cryptoDepositRepository = {
  async list(
    params: CryptoDepositListParams,
  ): Promise<ListPage<CryptoDeposit>> {
    const segment = params.isOperation ? 'operations' : 'users'
    const response = await clients.backoffice.post(
      `/crypto/deposit-history/${segment}/list`,
      {
        current: params.current,
        pageSize: params.pageSize,
        ...(params.query ? { query: params.query } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.currency ? { currency: params.currency } : {}),
      },
    )

    const page = unwrapList<CryptoDepositDto>(response.data, 'crypto-deposit')
    return { ...page, items: page.items.map(toCryptoDeposit) }
  },
}
