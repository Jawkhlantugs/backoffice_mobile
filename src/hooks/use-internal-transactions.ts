import { internalTransactionRepository } from '@/data/internal-transaction/internal-transaction-repository'

import { usePagedList } from './use-paged-list'

export const useInternalTransactions = (search: string) =>
  usePagedList(
    'internal-transactions',
    internalTransactionRepository.transactions,
    { search },
  )
export const useInternalTransactionRecords = (search: string) =>
  usePagedList(
    'internal-transaction-records',
    internalTransactionRepository.records,
    { search },
  )
export const useInternalBalances = (search: string) =>
  usePagedList('internal-balances', internalTransactionRepository.balances, {
    search,
  })
