import { cryptoRegistryRepository } from '@/data/crypto-registry/crypto-registry-repository'

import { usePagedList } from './use-paged-list'

export const useCoinListings = (search: string) =>
  usePagedList('crypto-coin-listings', cryptoRegistryRepository.coins, {
    search,
  })
export const useUserWalletAddresses = (search: string) =>
  usePagedList(
    'crypto-wallet-addresses',
    cryptoRegistryRepository.walletAddresses,
    { search },
  )
export const useWithdrawBans = (search: string) =>
  usePagedList('crypto-withdraw-bans', cryptoRegistryRepository.withdrawBans, {
    search,
  })
export const useDelistedTransfers = (search: string) =>
  usePagedList(
    'crypto-delisted-transfers',
    cryptoRegistryRepository.delistedTransfers,
    { search },
  )
