import { bankAccountRepository } from '@/data/bank-account/bank-account-repository'
import { withDefaultRange, type ListFilters } from '@/lib/list-filters'

import { usePagedList } from './use-paged-list'

export const useUserBankWallets = (
  search: string,
  options: { status?: string; filters?: ListFilters } = {},
) =>
  usePagedList('bank-user-wallets', bankAccountRepository.userWallets, {
    search,
    filters: {
      status: options.status,
      ...withDefaultRange(options.filters ?? {}),
    },
  })
export const useExchangeBankWallets = (search: string) =>
  usePagedList('bank-exchange-wallets', bankAccountRepository.exchangeWallets, {
    search,
  })
export const useBalanceTransactions = (search: string) =>
  usePagedList(
    'bank-balance-transactions',
    bankAccountRepository.balanceTransactions,
    { search },
  )
