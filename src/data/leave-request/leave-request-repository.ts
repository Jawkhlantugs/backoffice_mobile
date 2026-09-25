import { clients } from '@/core/network/clients'
import { unwrap, unwrapList, type ListPage } from '@/core/network/envelope'

import { toLeaveRequest, type LeaveRequestDto } from './leave-request-dto'
import type {
  LeaveRequest,
  LeaveStatus,
  LeaveUnit,
  NewLeaveRequest,
} from './leave-request-model'

/**
 * Endpoint: вэб админы `leave-request.service.ts`.
 * Pagination нь offset — хариунд `total` ирнэ (FLOWS.md §5.3).
 */

export type LeaveListParams = {
  page: number
  pageSize: number
  status?: LeaveStatus
  /** Зөвхөн нэг админы хүсэлт — "Миний хүсэлт" таб. */
  adminUserId?: string
}

export const leaveRequestRepository = {
  async list(params: LeaveListParams): Promise<ListPage<LeaveRequest>> {
    const response = await clients.backoffice.post(
      '/admin/leave-requests/list',
      {
        current: params.page,
        pageSize: params.pageSize,
        ...(params.status ? { status: params.status } : {}),
        ...(params.adminUserId ? { adminUserId: params.adminUserId } : {}),
      },
    )

    const page = unwrapList<LeaveRequestDto>(response.data, 'leave-requests')
    return { ...page, items: page.items.map(toLeaveRequest) }
  },

  async byId(id: string): Promise<LeaveRequest> {
    const response = await clients.backoffice.get(`/admin/leave-requests/${id}`)
    return toLeaveRequest(unwrap<LeaveRequestDto>(response.data))
  },

  async create(input: NewLeaveRequest): Promise<LeaveRequest> {
    const response = await clients.backoffice.post('/admin/leave-requests', {
      leaveType: input.type,
      requestType: input.unit satisfies LeaveUnit,
      startDate: input.startDate,
      endDate: input.endDate,
      ...(input.startTime ? { startTime: input.startTime } : {}),
      ...(input.endTime ? { endTime: input.endTime } : {}),
      reason: input.reason,
    })
    return toLeaveRequest(unwrap<LeaveRequestDto>(response.data))
  },

  async review(
    id: string,
    decision: 'APPROVED' | 'REJECTED',
    note?: string,
  ): Promise<LeaveRequest> {
    const response = await clients.backoffice.post(
      `/admin/leave-requests/${id}/review`,
      { status: decision, ...(note ? { reviewNote: note } : {}) },
    )
    return toLeaveRequest(unwrap<LeaveRequestDto>(response.data))
  },
}
