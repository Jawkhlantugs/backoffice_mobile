import { clients } from '@/core/network/clients'
import {
  unwrap,
  type CursorParams,
  type ListPage,
} from '@/core/network/envelope'
import { idempotencyHeaders } from '@/core/network/idempotency'

import {
  toConvertLimitOrder,
  type ConvertLimitOrderDto,
} from './convert-limit-dto'
import type { ConvertLimitOrder } from './convert-limit-model'

type ListData = { items?: ConvertLimitOrderDto[]; nextCursor?: string } | null

/**
 * Endpoint: `convert-limit.service.ts` — `{finance}/convert-limit/*`.
 * Жагсаалт нь GET, cursor нь тунгалаг мөр (`nextCursor`). Вэб mutation бүрт
 * `x-idempotency-key` явуулдаг тул mobile ч бас (CLAUDE.md §5).
 */
export const convertLimitRepository = {
  async list(
    params: CursorParams & { status?: string },
  ): Promise<ListPage<ConvertLimitOrder>> {
    const response = await clients.finance.get('/convert-limit/list', {
      params: {
        limit: params.limit,
        status: params.status,
        ...(params.cursor ? { cursor: params.cursor } : {}),
      },
    })
    const data = unwrap<ListData>(response.data)
    return {
      items: (data?.items ?? []).map(toConvertLimitOrder),
      lastEvaluatedKey: data?.nextCursor || undefined,
    }
  },

  async accept(id: string): Promise<void> {
    await clients.finance.post(`/convert-limit/${id}/accept`, undefined, {
      headers: idempotencyHeaders(),
    })
  },

  async complete(id: string): Promise<void> {
    await clients.finance.post(`/convert-limit/${id}/complete`, undefined, {
      headers: idempotencyHeaders(),
    })
  },

  async reopen(id: string): Promise<void> {
    await clients.finance.post(`/convert-limit/${id}/reopen`, undefined, {
      headers: idempotencyHeaders(),
    })
  },

  async reject(id: string, reason: string): Promise<void> {
    await clients.finance.post(
      `/convert-limit/${id}/reject`,
      { reason },
      { headers: idempotencyHeaders() },
    )
  },
}
