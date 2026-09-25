import { clients } from '@/core/network/clients'
import { unwrap, unwrapList, type ListPage } from '@/core/network/envelope'

import { toExchangeUser, type ExchangeUserDto } from './exchange-user-dto'
import type { ExchangeUser } from './exchange-user-model'

/** Endpoint: `kyc.service.ts` — `{backoffice}/users/list`, `/users/detail/{id}`. */
export type ExchangeUserListParams = {
  current: number
  pageSize: number
  query?: string
}

export const exchangeUserRepository = {
  async list(params: ExchangeUserListParams): Promise<ListPage<ExchangeUser>> {
    const response = await clients.backoffice.post('/users/list', {
      current: params.current,
      pageSize: params.pageSize,
      ...(params.query ? { query: params.query } : {}),
    })

    const page = unwrapList<ExchangeUserDto>(response.data, 'users')
    return { ...page, items: page.items.map(toExchangeUser) }
  },

  async byId(id: string): Promise<ExchangeUser> {
    const response = await clients.backoffice.get(`/users/detail/${id}`)
    return toExchangeUser(unwrap<ExchangeUserDto>(response.data))
  },
}
