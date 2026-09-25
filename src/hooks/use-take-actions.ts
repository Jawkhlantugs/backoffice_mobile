import { useMutation, useQuery } from '@tanstack/react-query'

import {
  takeActionRepository,
  type UserTakeActionListParams,
} from '@/data/take-action/take-action-repository'
import type { TakeActionStatus } from '@/data/take-action/take-action-model'

export const takeActionQueryKeys = {
  all: ['take-actions'] as const,
  list: (status?: TakeActionStatus) =>
    ['take-actions', 'list', status ?? 'all'] as const,
  responses: (params: UserTakeActionListParams) =>
    ['take-actions', 'responses', params] as const,
}

export function useTakeActions(status?: TakeActionStatus) {
  return useQuery({
    queryKey: takeActionQueryKeys.list(status),
    queryFn: () => takeActionRepository.list({ status }),
  })
}

export function useTakeActionResponses(params: UserTakeActionListParams) {
  return useQuery({
    queryKey: takeActionQueryKeys.responses(params),
    queryFn: () => takeActionRepository.userResponses(params),
  })
}

export function useTakeActionImageUrl() {
  return useMutation({
    mutationFn: (privateImageUrl: string) =>
      takeActionRepository.imageSignedUrl(privateImageUrl),
  })
}
