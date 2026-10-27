import { StatusPill, type StatusTone } from '@/components'
import type { TicketStatus } from '@/data/support-ticket/support-ticket-model'
import { messages } from '@/lib/messages'

const TONES: Record<TicketStatus, StatusTone> = {
  new: 'info',
  open: 'warning',
  pending: 'warning',
  solved: 'success',
}

export function TicketStatusPill({
  status,
  className,
}: {
  status: TicketStatus
  className?: string
}) {
  return (
    <StatusPill
      label={messages.supportTickets.statuses[status]}
      tone={TONES[status]}
      className={className}
    />
  )
}
