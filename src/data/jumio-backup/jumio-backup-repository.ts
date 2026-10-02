import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import { toJumioBackup } from './jumio-backup-dto'

/** Endpoint: `users.service.ts` — `POST {backoffice}/users/jumio-backup/list`. */
export const jumioBackupRepository = {
  list: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/users/jumio-backup/list',
      params,
      toJumioBackup,
    ),
}
