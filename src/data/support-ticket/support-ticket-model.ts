/**
 * Ticket-ийн domain model. Талбарын нэр, статусын утга нь вэб админы
 * `services/types/portal/support.types.ts`-аас — таамаглаагүй.
 */

export const TICKET_STATUSES = ['new', 'open', 'pending', 'solved'] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const TICKET_PRIORITIES = ['high', 'medium', 'low'] as const
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export type SupportTicket = {
  id: string
  title: string
  requesterLabel: string
  requesterId?: string
  status: TicketStatus
  priority?: TicketPriority
  assignee?: string
  categoryLabel?: string
  message?: string
  createdAt?: string
  updatedAt?: string
}
