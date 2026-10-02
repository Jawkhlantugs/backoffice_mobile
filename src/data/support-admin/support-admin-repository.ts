import { clients } from '@/core/network/clients'
import { unwrapList, type PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  flattenSupportCategories,
  toSupportAgent,
  toSupportMacro,
  toSupportRole,
  toSupportTeam,
  type SupportCategoryDto,
} from './support-admin-dto'
import type { SupportCategory } from './support-admin-model'

/** Ангилал цөөн — нэг дор татаж, эцэг/дэдийг вэб шиг дараалуулна. */
const CATEGORY_LIMIT = 200

/** Support endpoint-ууд `current/query` биш `page/search` хүлээнэ. */
const supportParams = (params: PageParams) => ({
  page: params.current,
  pageSize: params.pageSize,
  search: params.query,
})

/** Endpoint: `support.service.ts` — бүгд `{backoffice}/support/…`. */
export const supportAdminRepository = {
  // `marcos` — backend дээр нэр нь буруу бичигдсэн. Бүү зас.
  macros: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/support/marcos/list',
      supportParams(params),
      toSupportMacro,
    ),
  agents: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/support/agents/list',
      supportParams(params),
      toSupportAgent,
    ),
  roles: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/support/roles/list',
      supportParams(params),
      toSupportRole,
    ),
  teams: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/support/teams/list',
      supportParams(params),
      toSupportTeam,
    ),

  async categories(): Promise<SupportCategory[]> {
    const path = '/support/categories/data-list'
    const response = await clients.backoffice.post(path, {
      page: 1,
      pageSize: CATEGORY_LIMIT,
      parent: true,
    })
    const page = unwrapList<SupportCategoryDto>(response.data, path)
    return flattenSupportCategories(page.items)
  },
}
