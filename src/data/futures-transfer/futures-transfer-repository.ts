import { clients } from '@/core/network/clients'
import { idempotencyHeaders } from '@/core/network/idempotency'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toFuturesTransferRequest,
  type FuturesTransferRequestDto,
} from './futures-transfer-dto'
import type {
  FuturesTransferRequest,
  FuturesTransferStatus,
} from './futures-transfer-model'

/**
 * Endpoint: `futures-transfer.service.ts` — `{finance}/futures/transfer-requests`.
 * Cursor pagination. Вэб админ `approve`/`reject`-д `x-idempotency-key`
 * явуулдаг тул mobile ч бас (CLAUDE.md "Аюулгүй байдал" §5).
 */
export type FuturesTransferListParams = {
  status?: FuturesTransferStatus
  lastEvaluatedKey?: string
}

export const futuresTransferRepository = {
  async list(
    params: FuturesTransferListParams,
  ): Promise<ListPage<FuturesTransferRequest>> {
    const response = await clients.finance.post(
      '/futures/transfer-requests/list',
      {
        ...(params.status ? { substatus: params.status } : {}),
        ...(params.lastEvaluatedKey
          ? { lastEvaluatedKey: params.lastEvaluatedKey }
          : {}),
      },
    )

    const page = unwrapList<FuturesTransferRequestDto>(
      response.data,
      'futures-transfer-requests',
    )
    return { ...page, items: page.items.map(toFuturesTransferRequest) }
  },

  async approve(txnId: string, note?: string): Promise<void> {
    await clients.finance.post(
      `/futures/transfer-requests/${txnId}/approve`,
      { ...(note ? { note } : {}) },
      { headers: idempotencyHeaders() },
    )
  },

  async reject(txnId: string, reason: string): Promise<void> {
    await clients.finance.post(
      `/futures/transfer-requests/${txnId}/reject`,
      { reason },
      { headers: idempotencyHeaders() },
    )
  },
}
