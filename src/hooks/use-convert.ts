import { useMutation, useQueryClient } from '@tanstack/react-query'

import { convertRepository } from '@/data/convert/convert-repository'

import { usePagedList } from './use-paged-list'

export function useConvertRecords(options: { search?: string } = {}) {
  return usePagedList('convert', (params) => convertRepository.list(params), {
    search: options.search,
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
