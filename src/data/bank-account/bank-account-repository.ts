import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toBalanceTransaction,
  toExchangeBankWallet,
  toUserBankWallet,
} from './bank-account-dto'

/** Endpoint: `bank.service.ts` — `POST {backoffice}/banks/…/list`. */
export const bankAccountRepository = {
  userWallets: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/banks/user-bank-account-wallets/list',
      params,
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
