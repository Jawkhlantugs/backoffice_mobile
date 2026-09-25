import { useInfiniteQuery } from '@tanstack/react-query'

import type { CursorParams, ListPage } from '@/core/network/envelope'

import { useDebouncedValue } from './use-debounced-value'
import { LIST_PAGE_SIZE, type PagedList } from './use-paged-list'

/**
 * `usePagedList`-ийн DynamoDB хувилбар: хуудасны дугаар биш
 * `lastEvaluatedKey`-ээр дараагийнхыг татна. Буцаах хэлбэр ижил тул
 * `PagedListScreen` ялгааг мэдэхгүй.
 */
export function useCursorList<T, F extends Record<string, string | undefined>>(
  key: string,
  fetchPage: (params: CursorParams & Partial<F>) => Promise<ListPage<T>>,
  options: { search?: string; filters?: F } = {},
): PagedList<T> {
  const query = useDebouncedValue(options.search?.trim() ?? '') || undefined
  const filters = options.filters

  const result = useInfiniteQuery({
    queryKey: [key, 'cursor', query ?? '', filters ?? {}],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      fetchPage({
        limit: LIST_PAGE_SIZE,
        ...(pageParam ? { cursor: pageParam } : {}),
        ...(query ? { query } : {}),
        ...(filters ?? {}),
      } as CursorParams & Partial<F>),
    getNextPageParam: (last) => last.lastEvaluatedKey || undefined,
  })

  return {
    items: result.data?.pages.flatMap((page) => page.items) ?? [],
    total: result.data?.pages[0]?.total,
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
