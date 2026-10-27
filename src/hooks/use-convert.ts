import { useMutation, useQueryClient } from '@tanstack/react-query'

import { convertRepository } from '@/data/convert/convert-repository'
import { withDefaultRange, type ListFilters } from '@/lib/list-filters'

import { usePagedList } from './use-paged-list'

export function useConvertRecords(
  options: { search?: string; status?: string; filters?: ListFilters } = {},
) {
  return usePagedList('convert', (params) => convertRepository.list(params), {
    search: options.search,
    filters: {
      status: options.status,
      ...withDefaultRange(options.filters ?? {}),
    },
  })
}

export function useRetryConvert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => convertRepository.retry(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['convert'] })
    },
  })
}
