import type { ListPage } from '@/core/network/envelope'

import { exchangeUserRepository } from './exchange-user-repository'

type UserKey = 'id' | 'subAccountId'

/**
 * Зөвхөн ID хүлээдэг endpoint-д имэйлээр хайхын тулд `/users/list`-ээс (вэбийн
 * monitor-users combobox) ID-г олно. Зөвхөн яг таарсан имэйл — өөр хүний бичлэг
 * харуулахгүйн тулд. `null` = ийм имэйлтэй хэрэглэгч алга.
 */
export async function resolveUserSearch(
  query: string | undefined,
  key: UserKey = 'id',
): Promise<string | null | undefined> {
  if (!query?.includes('@')) return query
  const email = query.toLowerCase()
  const page = await exchangeUserRepository.list({
    current: 1,
    pageSize: 20,
    query,
  })
  const user = page.items.find((item) => item.email.toLowerCase() === email)
  return user?.[key] ?? null
}

/** Олдоогүй имэйлд шүүлтгүй жагсаалт биш, хоосон хуудас буцаана. */
export function withUserSearch<P extends { query?: string }, T>(
  fetchPage: (params: P) => Promise<ListPage<T>>,
  key: UserKey = 'id',
) {
  return async (params: P): Promise<ListPage<T>> => {
    const query = await resolveUserSearch(params.query, key)
    if (query === null) return { items: [], total: 0 }
    return fetchPage({ ...params, query })
  }
}
