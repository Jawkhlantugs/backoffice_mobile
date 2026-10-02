import { clients } from '@/core/network/clients'
import { unwrap, type ListPage, type PageParams } from '@/core/network/envelope'

import {
  toCrystalCustomer,
  toCrystalTransfer,
  type CrystalCustomerDto,
  type CrystalTransferDto,
} from './crystal-dto'
import type { CrystalCustomer, CrystalTransfer } from './crystal-model'

/**
 * Endpoint: `crystalintelligence.service.ts` — `{backoffice}/crystal/monitor/*`.
 * Offset хуудаслалт, нийт тоогүй (`with_total: 0`) — дүүрэн хуудас бол
 * дараагийнх бий гэж үзнэ. Хариу `body.data` массив.
 */
async function monitorList<Dto, Model>(
  path: string,
  params: PageParams,
  order: string,
  filter: Record<string, unknown>,
  toModel: (dto: Dto) => Model,
): Promise<ListPage<Model>> {
  const response = await clients.crystal.post(path, {
    with_total: 0,
    offset: (params.current - 1) * params.pageSize,
    limit: params.pageSize,
    order,
    direction: 'desc',
    filter,
  })
  const body = unwrap<{ data?: Dto[] } | Dto[] | null>(response.data)
  const items = Array.isArray(body) ? body : (body?.data ?? [])
  return { items: items.map(toModel) }
}

export const crystalRepository = {
  /** Вэбийн анхдагч эрэмбэ `updated_at desc`; шүүлтүүр нь alert grade. */
  transfers: (
    params: PageParams & { alertGrade?: string },
  ): Promise<ListPage<CrystalTransfer>> =>
    monitorList<CrystalTransferDto, CrystalTransfer>(
      '/monitor/batch/txs',
      params,
      'updated_at',
      params.alertGrade ? { alert_grade: [params.alertGrade] } : {},
      toCrystalTransfer,
    ),

  customers: (params: PageParams): Promise<ListPage<CrystalCustomer>> =>
    monitorList<CrystalCustomerDto, CrystalCustomer>(
      '/monitor/list',
      params,
      'last_added',
      {},
      toCrystalCustomer,
    ),
}
