/**
 * Чөлөө хүсэлтийн domain model. Талбарын нэр, статусын утга нь вэб админы
 * `services/types/office/leave-request.types.ts`-аас — таамаглаагүй.
 */

export const LEAVE_TYPES = ['ANNUAL', 'SICK', 'PERSONAL', 'OTHER'] as const
export type LeaveType = (typeof LEAVE_TYPES)[number]

export const LEAVE_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const
export type LeaveStatus = (typeof LEAVE_STATUSES)[number]

export type LeaveUnit = 'day' | 'hour'

export type LeaveRequest = {
  id: string
  /** Хүсэлт гаргасан админы харагдах нэр — имэйл эсвэл id. */
  requester: string
  department?: string
  type: LeaveType
  unit: LeaveUnit
  startDate: string
  endDate: string
  /** Цагаар авах үед л утгатай. */
  startTime?: string
  endTime?: string
  reason: string
  status: LeaveStatus
  reviewer?: string
  reviewNote?: string
  createdAt?: string
}

export type NewLeaveRequest = {
  type: LeaveType
  unit: LeaveUnit
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  reason: string
}
