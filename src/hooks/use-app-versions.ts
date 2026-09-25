import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { AppOs, AppVersionInput } from '@/data/app-version/app-version-model'
import { appVersionRepository } from '@/data/app-version/app-version-repository'

import { useCursorList } from './use-cursor-list'

const KEY = 'app-versions'

export const useAppVersions = (os?: AppOs) =>
  useCursorList(KEY, appVersionRepository.list, { filters: { os } })

export function useAppVersion(id: string) {
  return useQuery({
    queryKey: [KEY, 'detail', id],
    queryFn: () => appVersionRepository.byId(id),
    enabled: id.length > 0,
  })
}

export function useSaveAppVersion(id?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AppVersionInput) =>
      id ? appVersionRepository.update(id, input) : appVersionRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [KEY] })
    },
  })
}
