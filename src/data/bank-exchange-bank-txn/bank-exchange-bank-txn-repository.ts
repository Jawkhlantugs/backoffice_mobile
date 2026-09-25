import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toBankExchangeBankTxn,
  type BankExchangeBankTxnDto,
} from './bank-exchange-bank-txn-dto'
import type { BankExchangeBankTxn } from './bank-exchange-bank-txn-model'

/** Endpoint: `bank.service.ts` — `POST {backoffice}/banks/exchange-bank-txn/list`. */
export type BankExchangeBankTxnListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
  currency?: string
}

export const bankExchangeBankTxnRepository = {
  async list(
    params: BankExchangeBankTxnListParams,
  ): Promise<ListPage<BankExchangeBankTxn>> {
    const response = await clients.backoffice.post(
      '/banks/exchange-bank-txn/list',
      {
        current: params.current,
        pageSize: params.pageSize,
        ...(params.query ? { query: params.query } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.currency ? { currency: params.currency } : {}),
      },
    )

    const page = unwrapList<BankExchangeBankTxnDto>(
      response.data,
      'exchange-bank-txn',
    )
    return { ...page, items: page.items.map(toBankExchangeBankTxn) }
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async solve(txnId: string, message: string): Promise<void> {
    await clients.finance.post(`/bank-transaction/${txnId}/solve`, { message })
  },

  async refund(txnId: string, iban: string): Promise<void> {
    await clients.finance.post(`/bank-transaction/${txnId}/refund`, { iban })
  },
}
