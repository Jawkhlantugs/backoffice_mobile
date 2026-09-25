import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import { toBankWithdrawal, type BankWithdrawalDto } from './bank-withdrawal-dto'
import type { BankWithdrawal } from './bank-withdrawal-model'

/** Endpoint: `bank.service.ts` — `POST {backoffice}/banks/withdrawals/list`. */
export type BankWithdrawalListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
  currency?: string
}

export const bankWithdrawalRepository = {
  async list(
    params: BankWithdrawalListParams,
  ): Promise<ListPage<BankWithdrawal>> {
    const response = await clients.backoffice.post('/banks/withdrawals/list', {
      current: params.current,
      pageSize: params.pageSize,
      ...(params.query ? { query: params.query } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.currency ? { currency: params.currency } : {}),
    })

    const page = unwrapList<BankWithdrawalDto>(
      response.data,
      'bank-withdrawals',
    )
    return { ...page, items: page.items.map(toBankWithdrawal) }
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async markTransferred(id: string): Promise<void> {
    await clients.bankV2.put(`/user-bank-withdraw/${id}/mark-transferred`)
  },
}
