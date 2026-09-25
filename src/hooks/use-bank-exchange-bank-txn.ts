import { useMutation, useQueryClient } from '@tanstack/react-query'

import { bankExchangeBankTxnRepository } from '@/data/bank-exchange-bank-txn/bank-exchange-bank-txn-repository'

import { usePagedList } from './use-paged-list'

export function useBankExchangeBankTxns(options: { search?: string } = {}) {
  return usePagedList(
    'bank-exchange-bank-txn',
    (params) => bankExchangeBankTxnRepository.list(params),
    { search: options.search },
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
