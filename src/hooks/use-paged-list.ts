import { useInfiniteQuery } from '@tanstack/react-query'

import type { ListPage, PageParams } from '@/core/network/envelope'

import { useDebouncedValue } from './use-debounced-value'

export const LIST_PAGE_SIZE = 20

/**
 * Жагсаалтын ганц хэв маяг: хайлтыг 400ms хүлээж, доош гүйлгэхэд дараагийн
 * хуудсыг татна. Вэбийн `useFilterParams`-тай ижил `current/pageSize/query`.
 * Нийт тоо ирвэл түүгээр, ирээгүй бол дүүрэн хуудсаар "дараагийнх бий" гэж үзнэ.
 */
export function usePagedList<T, F extends Record<string, string | undefined>>(
  key: string,
  fetchPage: (params: PageParams & Partial<F>) => Promise<ListPage<T>>,
  options: { search?: string; filters?: F } = {},
) {
  const query = useDebouncedValue(options.search?.trim() ?? '') || undefined
  const filters = options.filters

  const result = useInfiniteQuery({
    queryKey: [key, 'paged', query ?? '', filters ?? {}],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchPage({
        current: pageParam,
        pageSize: LIST_PAGE_SIZE,
        ...(query ? { query } : {}),
        ...(filters ?? {}),
      } as PageParams & Partial<F>),
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((sum, page) => sum + page.items.length, 0)
      const more =
        last.total !== undefined
          ? loaded < last.total
          : last.items.length === LIST_PAGE_SIZE
      return more ? pages.length + 1 : undefined
    },
  })

  const items = result.data?.pages.flatMap((page) => page.items) ?? []
  const total = result.data?.pages[0]?.total

  return {
    items,
    total,
    isPending: result.isPending,
    error: result.error,
    refetch: result.refetch,
    loadMore: () => {
      if (result.hasNextPage && !result.isFetchingNextPage)
        void result.fetchNextPage()
    },
    loadingMore: result.isFetchingNextPage,
  }
}

export type PagedList<T> = ReturnType<
  typeof usePagedList<T, Record<string, string | undefined>>
>
