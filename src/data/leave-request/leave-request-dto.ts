import type {
  LeaveRequest,
  LeaveStatus,
  LeaveType,
} from './leave-request-model'

/**
 * Серверийн JSON. Талбарын нэр нь вэб админы
 * `types/office/leave-request.types.ts`-аас — энэ файлаас цааш гарахгүй.
 */
export type LeaveRequestDto = {
  id?: string
  adminUserId?: string
  adminUser?: {
    email?: string
    department?: string
    adminGroup?: { name?: string }
  }
  leaveType?: string
  requestType?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  reason?: string
  status?: string
  reviewer?: { email?: string }
  reviewNote?: string
  created_at?: string
}

const KNOWN_TYPES: LeaveType[] = ['ANNUAL', 'SICK', 'PERSONAL', 'OTHER']
const KNOWN_STATUSES: LeaveStatus[] = ['PENDING', 'APPROVED', 'REJECTED']

/**
 * Танихгүй утга ирвэл унахгүй: чөлөөний төрөл нэмэгдэх нь backend дээр
 * ердийн зүйл, харин апп унах нь биш.
 */
function toType(raw: string | undefined): LeaveType {
  return KNOWN_TYPES.find((type) => type === raw) ?? 'OTHER'
}

/** Статус нь харин эрхийн шийдвэрт нөлөөлнө — танихгүй бол хамгийн
 * хязгаарлагдмал утга (PENDING) руу буулгана. */
function toStatus(raw: string | undefined): LeaveStatus {
  return KNOWN_STATUSES.find((status) => status === raw) ?? 'PENDING'
}

/** Сервер `2026-10-26T00:00:00Z` гэж буцаадаг ч энэ нь агшин биш, хуанлийн
 * өдөр — dayjs-ээр задалбал UTC-ээс хойшхи бүсэд өмнөх өдөр рүү шилжинэ. */
function toCalendarDate(raw: string | undefined): string | undefined {
  return raw?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? raw
}

/** `16:30:00` → `16:30`; секунд картанд илүүц. */
function toClockTime(raw: string | undefined): string | undefined {
  return raw?.match(/^\d{2}:\d{2}/)?.[0] ?? (raw || undefined)
}

export function toLeaveRequest(dto: LeaveRequestDto): LeaveRequest {
  return {
    id: dto.id ?? '',
    requester: dto.adminUser?.email ?? dto.adminUserId ?? '',
    department: dto.adminUser?.department ?? dto.adminUser?.adminGroup?.name,
    type: toType(dto.leaveType),
    unit: dto.requestType === 'hour' ? 'hour' : 'day',
    startDate: toCalendarDate(dto.startDate) ?? '',
    endDate: toCalendarDate(dto.endDate ?? dto.startDate) ?? '',
    startTime: toClockTime(dto.startTime),
    endTime: toClockTime(dto.endTime),
    reason: dto.reason ?? '',
    status: toStatus(dto.status),
    reviewer: dto.reviewer?.email,
    reviewNote: dto.reviewNote,
    createdAt: dto.created_at,
  }
}
