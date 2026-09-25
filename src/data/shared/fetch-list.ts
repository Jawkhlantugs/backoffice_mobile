import type { AxiosInstance } from 'axios'

import { unwrapList, type ListPage } from '@/core/network/envelope'

/**
 * Жагсаалтын endpoint-ийн нийтлэг алхам: POST → дугтуй задлах → model.
 * Хоосон шүүлтүүрийг явуулахгүй — backend `query: ''`-г "хоосонтой таарах"
 * гэж ойлгох эрсдэлтэй.
 */
export async function fetchList<Dto, Model>(
  client: AxiosInstance,
  path: string,
  params: Record<string, unknown>,
  toModel: (dto: Dto) => Model,
): Promise<ListPage<Model>> {
  const body = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  )
  const response = await client.post(path, body)
  const page = unwrapList<Dto>(response.data, path)
  return { ...page, items: page.items.map(toModel) }
}
