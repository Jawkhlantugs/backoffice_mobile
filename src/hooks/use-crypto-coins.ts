import { useQuery } from '@tanstack/react-query'

import { cryptoCoinRepository } from '@/data/crypto-coin/crypto-coin-repository'

/** Coin жагсаалт бараг өөрчлөгддөггүй — вэбтэй ижил 5 минут. */
const COINS_STALE_MS = 5 * 60_000

export function useCryptoCoins() {
  return useQuery({
    queryKey: ['crypto-coins', 'all'],
    queryFn: () => cryptoCoinRepository.listAll(),
    staleTime: COINS_STALE_MS,
  })
}
