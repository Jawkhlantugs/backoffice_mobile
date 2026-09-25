import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toInternalBalance,
  toInternalTransaction,
  toInternalTransactionRecord,
} from './internal-transaction-dto'

/** Endpoint: `internal.service.ts` — `POST {backoffice}/internal/…/list`. */
export const internalTransactionRepository = {
  transactions: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/internal/transactions/list',
      params,
      toInternalTransaction,
    ),
  records: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/internal/transaction-records/list',
      params,
      toInternalTransactionRecord,
    ),
  balances: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/internal/balances/list',
      params,
      toInternalBalance,
    ),
}
