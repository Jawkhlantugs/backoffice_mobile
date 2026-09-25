import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { pushNotificationRepository } from '@/data/push-notification/push-notification-repository'
import type {
  NewPushNotification,
  PushNotificationStatus,
} from '@/data/push-notification/push-notification-model'

const QUERY_KEY = ['push-notifications'] as const

export function usePushNotifications() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => pushNotificationRepository.list(),
  })
}

export function useCreatePushNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewPushNotification) =>
      pushNotificationRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useUpdatePushNotificationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      pid,
      status,
    }: {
      pid: string
      status: Extract<PushNotificationStatus, 'PROCESSING' | 'REJECTED'>
    }) => pushNotificationRepository.updateStatus(pid, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
