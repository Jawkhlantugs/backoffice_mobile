import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  cryptoBlockedWalletRepository,
  type NewWalletBan,
} from '@/data/crypto-blocked-wallet/crypto-blocked-wallet-repository'

import { usePagedList } from './use-paged-list'

export function useCryptoBlockedWallets(options: { search?: string } = {}) {
  return usePagedList(
    'crypto-blocked-wallets',
    (params) => cryptoBlockedWalletRepository.list(params),
    { search: options.search },
  )
}

export function useBanWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewWalletBan) =>
      cryptoBlockedWalletRepository.ban(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['crypto-blocked-wallets'],
      })
    },
  })
}
