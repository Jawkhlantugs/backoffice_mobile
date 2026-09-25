import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toBankExchangeTxnTask,
  type BankExchangeTxnTaskDto,
} from './bank-exchange-txn-task-dto'
import type { BankExchangeTxnTask } from './bank-exchange-txn-task-model'

/** Endpoint: `bank.service.ts` — `POST {backoffice}/banks/exchange-txn-task/list`. */
export type BankExchangeTxnTaskListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
  currency?: string
}

export const bankExchangeTxnTaskRepository = {
  async list(
    params: BankExchangeTxnTaskListParams,
  ): Promise<ListPage<BankExchangeTxnTask>> {
    const response = await clients.backoffice.post(
      '/banks/exchange-txn-task/list',
      {
        current: params.current,
        pageSize: params.pageSize,
        ...(params.query ? { query: params.query } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.currency ? { currency: params.currency } : {}),
      },
    )

    const page = unwrapList<BankExchangeTxnTaskDto>(
      response.data,
      'exchange-txn-task',
    )
    return { ...page, items: page.items.map(toBankExchangeTxnTask) }
  },
}
