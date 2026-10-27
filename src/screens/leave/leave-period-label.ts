import type { LeaveRequest } from '@/data/leave-request/leave-request-model'

/** Хугацааг нэг мөрөнд: `2026-10-26 · 16:30–18:00` эсвэл `2026-10-26 → 2026-10-28`. */
export function leavePeriodLabel(request: LeaveRequest): string {
  const range =
    request.startDate === request.endDate
      ? request.startDate
      : `${request.startDate} → ${request.endDate}`

  if (request.unit !== 'hour' || !request.startTime) return range
  return `${range} · ${request.startTime}–${request.endTime ?? ''}`
}
