import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toCryptoWithdrawal,
  type CryptoWithdrawalDto,
} from './crypto-withdrawal-dto'
import type { CryptoWithdrawal } from './crypto-withdrawal-model'

/** Endpoint: `crypto.service.ts` — `POST {backoffice}/crypto/withdrawal-history/list`. */
export type CryptoWithdrawalListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
  coin?: string
}

export const cryptoWithdrawalRepository = {
  async list(
    params: CryptoWithdrawalListParams,
  ): Promise<ListPage<CryptoWithdrawal>> {
    const response = await clients.backoffice.post(
      '/crypto/withdrawal-history/list',
      {
        current: params.current,
        pageSize: params.pageSize,
        ...(params.query ? { query: params.query } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.coin ? { coin: params.coin } : {}),
      },
    )

    const page = unwrapList<CryptoWithdrawalDto>(
      response.data,
      'crypto-withdrawal',
    )
    return { ...page, items: page.items.map(toCryptoWithdrawal) }
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async action(historyId: string, action: 'APPROVE' | 'REFUND'): Promise<void> {
    await clients.finance.post('/crypto-withdraw/action', { historyId, action })
  },
}
