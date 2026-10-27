import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'
import { withSortDate } from '@/data/shared/sort-date'

import {
  toBalanceTransaction,
  toExchangeBankWallet,
  toUserBankWallet,
} from './bank-account-dto'

/** Вэбийн `bank/wallets/constants.ts`-ийн `FILTER_KEYS` + огноо. */
export type UserWalletListParams = PageParams & {
  id?: string
  status?: string
  accountNumber?: string
  accountName?: string
  start_day?: string
  end_day?: string
}

/** Endpoint: `bank.service.ts` — `POST {backoffice}/banks/…/list`. */
export const bankAccountRepository = {
  userWallets: (params: UserWalletListParams) =>
    fetchList(
      clients.backoffice,
      '/banks/user-bank-account-wallets/list',
      withSortDate(params),
      toUserBankWallet,
    ),
  exchangeWallets: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/banks/exchange-bank-wallets/list',
      params,
      toExchangeBankWallet,
    ),
  balanceTransactions: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/banks/balance-transactions/list',
      params,
      toBalanceTransaction,
    ),
}
