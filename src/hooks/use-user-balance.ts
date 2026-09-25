import { useQuery } from '@tanstack/react-query'

import { userBalanceRepository } from '@/data/exchange-user/user-balance-repository'

export function useUserBalance(uid: string) {
  return useQuery({
    queryKey: ['user-balance', uid],
    queryFn: () => userBalanceRepository.current(uid),
    enabled: uid.length > 0,
  })
}
