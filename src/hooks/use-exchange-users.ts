import { useQuery } from '@tanstack/react-query'

import { exchangeUserRepository } from '@/data/exchange-user/exchange-user-repository'

const PAGE_SIZE = 20

export function useExchangeUsers(search: string) {
  const query = search.trim()

  return useQuery({
    queryKey: ['exchange-users', 'search', query],
    queryFn: () =>
      exchangeUserRepository.list({ current: 1, pageSize: PAGE_SIZE, query }),
    enabled: query.length > 0,
  })
}

export function useExchangeUser(id: string) {
  return useQuery({
    queryKey: ['exchange-users', 'detail', id],
    queryFn: () => exchangeUserRepository.byId(id),
    enabled: id.length > 0,
  })
}
