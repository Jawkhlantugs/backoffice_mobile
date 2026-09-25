import { StatusPill, type StatusTone } from '@/components'
import type { LeaveStatus } from '@/data/leave-request/leave-request-model'
import { messages } from '@/lib/messages'

const TONES: Record<LeaveStatus, StatusTone> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
}

export function LeaveStatusPill({ status }: { status: LeaveStatus }) {
  return (
    <StatusPill label={messages.leave.statuses[status]} tone={TONES[status]} />
  )
}
