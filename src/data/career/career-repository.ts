import { clients } from '@/core/network/clients'
import type { CursorParams } from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import { toJobApplication, toJobPosting } from './career-dto'
import type { JobApplicationStatus } from './career-model'

type StatusParams = CursorParams & { status?: string }

/**
 * Endpoint: `career.service.ts` — `{content}/careers/*`. Статус заавал
 * (вэб таб бүрт нэг статус).
 */
export const careerRepository = {
  postings: (params: StatusParams) =>
    fetchCursorList(
      clients.content,
      '/careers/postings/list',
      params,
      { limit: params.limit, status: params.status },
      toJobPosting,
    ),
  applications: (params: StatusParams) =>
    fetchCursorList(
      clients.content,
      '/careers/applications/list',
      params,
      { limit: params.limit, status: params.status },
      toJobApplication,
    ),

  async updateApplicationStatus(
    id: string,
    status: JobApplicationStatus,
  ): Promise<void> {
    await clients.content.post('/careers/applications/update', { id, status })
  },
}
