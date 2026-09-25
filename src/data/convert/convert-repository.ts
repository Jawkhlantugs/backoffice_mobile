import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import { toConvertRecord, type ConvertRecordDto } from './convert-dto'
import type { ConvertRecord } from './convert-model'

/** Endpoint: `convert.service.ts` — `POST {backoffice}/convert/list`. */
export type ConvertListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
}

export const convertRepository = {
  async list(params: ConvertListParams): Promise<ListPage<ConvertRecord>> {
    const response = await clients.backoffice.post('/convert/list', {
      current: params.current,
      pageSize: params.pageSize,
      ...(params.query ? { query: params.query } : {}),
      ...(params.status ? { status: params.status } : {}),
    })

    const page = unwrapList<ConvertRecordDto>(response.data, 'convert')
    return { ...page, items: page.items.map(toConvertRecord) }
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async retry(id: string): Promise<void> {
    await clients.finance.post('/convert/retry', { id })
  },
}
