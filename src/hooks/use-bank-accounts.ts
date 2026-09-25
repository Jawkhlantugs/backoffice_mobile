import { bankAccountRepository } from '@/data/bank-account/bank-account-repository'

import { usePagedList } from './use-paged-list'

export const useUserBankWallets = (search: string) =>
  usePagedList('bank-user-wallets', bankAccountRepository.userWallets, {
    search,
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
