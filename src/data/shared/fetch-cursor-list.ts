import type { AxiosInstance } from 'axios'

import {
  unwrap,
  type CursorParams,
  type ListPage,
} from '@/core/network/envelope'

import { decodeCursor, encodeCursor } from './cursor'

type CursorListData<Dto> = {
  list?: Dto[]
  total?: number
  lastEvaluatedKey?: unknown
} | null

/**
 * DynamoDB жагсаалт: `{code, msg, data: {list, total, lastEvaluatedKey}}`.
 * `unwrapList` объект cursor-ыг хаядаг тул энд задална. `data: null` бол хоосон.
 */
export async function fetchCursorList<Dto, Model>(
  client: AxiosInstance,
  path: string,
  params: CursorParams,
  body: Record<string, unknown>,
  toModel: (dto: Dto) => Model,
): Promise<ListPage<Model>> {
  const key = decodeCursor(params.cursor)
  const response = await client.post(path, {
    ...Object.fromEntries(
      Object.entries(body).filter(([, value]) => value !== undefined),
    ),
    ...(key === undefined ? {} : { lastEvaluatedKey: key }),
  })
  const data = unwrap<CursorListData<Dto>>(response.data)
  return {
    items: (data?.list ?? []).map(toModel),
    total: data?.total,
    lastEvaluatedKey: encodeCursor(data?.lastEvaluatedKey),
  }
}
