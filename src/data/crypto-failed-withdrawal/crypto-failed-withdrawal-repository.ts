import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toCryptoFailedWithdrawal,
  type CryptoFailedWithdrawalDto,
} from './crypto-failed-withdrawal-dto'
import type { CryptoFailedWithdrawal } from './crypto-failed-withdrawal-model'

/** Endpoint: `crypto.service.ts` — `POST {backoffice}/crypto/failed-withdrawals/list`. */
export type CryptoFailedWithdrawalListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
}

export const cryptoFailedWithdrawalRepository = {
  async list(
    params: CryptoFailedWithdrawalListParams,
  ): Promise<ListPage<CryptoFailedWithdrawal>> {
    const response = await clients.backoffice.post(
      '/crypto/failed-withdrawals/list',
      {
        current: params.current,
        pageSize: params.pageSize,
        ...(params.query ? { query: params.query } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    )

    const page = unwrapList<CryptoFailedWithdrawalDto>(
      response.data,
      'crypto-failed-withdrawals',
    )
    return { ...page, items: page.items.map(toCryptoFailedWithdrawal) }
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async manualRefund(id: string): Promise<void> {
    await clients.finance.post('/failed-withdraw/manual', { id })
  },
}
