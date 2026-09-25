import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import { toKycInfo } from './kyc-info-dto'

/** Endpoint: `users.service.ts` — `POST {backoffice}/users/kyc-info/list`. */
export const kycInfoRepository = {
  list: (params: PageParams) =>
    fetchList(clients.backoffice, '/users/kyc-info/list', params, toKycInfo),
}
