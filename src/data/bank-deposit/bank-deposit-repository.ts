import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import { toBankDeposit, type BankDepositDto } from './bank-deposit-dto'
import type { BankDeposit } from './bank-deposit-model'

/** Endpoint: `bank.service.ts` — `POST {backoffice}/banks/deposits/list`. */
export type BankDepositListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
  currency?: string
}

export const bankDepositRepository = {
  async list(params: BankDepositListParams): Promise<ListPage<BankDeposit>> {
    const response = await clients.backoffice.post('/banks/deposits/list', {
      current: params.current,
      pageSize: params.pageSize,
      ...(params.query ? { query: params.query } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.currency ? { currency: params.currency } : {}),
    })

    const page = unwrapList<BankDepositDto>(response.data, 'bank-deposits')
    return { ...page, items: page.items.map(toBankDeposit) }
  },
}
