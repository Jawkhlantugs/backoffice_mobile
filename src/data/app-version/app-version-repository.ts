import { clients } from '@/core/network/clients'
import { AppErrors } from '@/core/errors/app-exception'
import {
  unwrap,
  type CursorParams,
  type ListPage,
} from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import {
  toAppVersion,
  toAppVersionWrite,
  type AppVersionDto,
} from './app-version-dto'
import type { AppOs, AppVersion, AppVersionInput } from './app-version-model'

/** Endpoint: `app-versions.service.ts` — `{content}/mobile/app-version…`. */
export const appVersionRepository = {
  list: (
    params: CursorParams & { os?: AppOs },
  ): Promise<ListPage<AppVersion>> =>
    fetchCursorList(
      clients.content,
      '/mobile/app-version/list',
      params,
      { limit: params.limit, os: params.os },
      toAppVersion,
    ),

  async byId(id: string): Promise<AppVersion> {
    const response = await clients.content.get(`/mobile/app-version/${id}`)
    const dto = unwrap<AppVersionDto | null>(response.data)
    if (!dto) throw AppErrors.parse(`app-version ${id} хоосон ирлээ`)
    return toAppVersion(dto)
  },

  async create(input: AppVersionInput): Promise<void> {
    await clients.content.post('/mobile/app-version', toAppVersionWrite(input))
  },

  async update(id: string, input: AppVersionInput): Promise<void> {
    await clients.content.put(
      `/mobile/app-version/${id}`,
      toAppVersionWrite(input),
    )
  },
}
