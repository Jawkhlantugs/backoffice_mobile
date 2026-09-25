import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'

import { leaveRequestRepository } from '@/data/leave-request/leave-request-repository'
import type {
  LeaveRequest,
  LeaveStatus,
  NewLeaveRequest,
} from '@/data/leave-request/leave-request-model'

const PAGE_SIZE = 20

export const leaveQueryKeys = {
  all: ['leave-requests'] as const,
  list: (scope: string, status?: LeaveStatus) =>
    ['leave-requests', 'list', scope, status ?? 'all'] as const,
  detail: (id: string) => ['leave-requests', 'detail', id] as const,
}

export function useLeaveRequests(options: {
  status?: LeaveStatus
  /** Өгвөл зөвхөн тухайн админы хүсэлт. */
  adminUserId?: string
  /** Эрхгүй админд хүсэлт огт явуулахгүй (§11.9). */
  enabled?: boolean
}) {
  const { status, adminUserId, enabled = true } = options

  return useQuery({
    queryKey: leaveQueryKeys.list(adminUserId ?? 'all', status),
    queryFn: () =>
      leaveRequestRepository.list({
        page: 1,
        pageSize: PAGE_SIZE,
        status,
        adminUserId,
      }),
    enabled,
  })
}

export function useLeaveRequest(id: string) {
  return useQuery({
    queryKey: leaveQueryKeys.detail(id),
    queryFn: () => leaveRequestRepository.byId(id),
    enabled: id.length > 0,
  })
}

export function useCreateLeaveRequest(): UseMutationResult<
  LeaveRequest,
  unknown,
  NewLeaveRequest
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NewLeaveRequest) =>
      leaveRequestRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leaveQueryKeys.all })
    },
  })
}

export type ReviewInput = {
  id: string
  decision: 'APPROVED' | 'REJECTED'
  note?: string
}

export function useReviewLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, decision, note }: ReviewInput) =>
      leaveRequestRepository.review(id, decision, note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leaveQueryKeys.all })
    },
  })
}
