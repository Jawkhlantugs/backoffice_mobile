import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ExchangeBankTxnAmountType } from '@/data/bank-exchange-bank-txn/bank-exchange-bank-txn-model'
import { bankExchangeBankTxnRepository } from '@/data/bank-exchange-bank-txn/bank-exchange-bank-txn-repository'
import type { AmountCondition } from '@/data/shared/amount-filter'
import { recentRange, type RangePeriod } from '@/lib/date-range'

import { usePagedList } from './use-paged-list'

/** Шүүлтүүрийн хавтангийн утга — вэбийн filter panel-тай ижил талбарууд. */
export type BankExchangeBankTxnFilters = {
  id?: string
  amountType?: ExchangeBankTxnAmountType
  mainAccountNumber?: string
  relatedAccountNumber?: string
  amount?: string
  condition?: AmountCondition
  period?: RangePeriod
}

export function useBankExchangeBankTxns(
  options: {
    search?: string
    processStatus?: string
    filters?: BankExchangeBankTxnFilters
  } = {},
) {
  const { period, ...filters } = options.filters ?? {}

  return usePagedList(
    'bank-exchange-bank-txn',
    (params) => bankExchangeBankTxnRepository.list(params),
    {
      search: options.search,
      filters: {
        processStatus: options.processStatus,
        ...filters,
        ...(period ? recentRange(period) : {}),
      },
    },
  )
}

export function useSolveBankExchangeBankTxn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ txnId, message }: { txnId: string; message: string }) =>
      bankExchangeBankTxnRepository.solve(txnId, message),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['bank-exchange-bank-txn'],
      })
    },
  })
}

export function useRefundBankExchangeBankTxn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ txnId, iban }: { txnId: string; iban: string }) =>
      bankExchangeBankTxnRepository.refund(txnId, iban),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['bank-exchange-bank-txn'],
      })
    },
  })
}
