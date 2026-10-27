/**
 * Ticket-ийн domain model. Талбарын нэр, статусын утга нь вэб админы
 * `services/types/portal/support.types.ts`-аас — таамаглаагүй.
 */

export const TICKET_STATUSES = ['new', 'open', 'pending', 'solved'] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]

export type SupportTicket = {
  id: string
  title: string
  requesterLabel: string
  requesterId?: string
  /** `conversation.send`-ийн `uid`. */
  customerUid?: string
  status: TicketStatus
  /** Вэбийн адил түүхий утга (`normal`, `high`…) — танихгүйг ч хаяхгүй. */
  priority?: string
  assignee?: string
  categoryLabel?: string
  /** Харилцагчийн анхны мессеж (HTML) — ярианы эхний мөр болж харагдана. */
  ticketMessage?: string
  /** Хавсралтын URL. */
  file?: string
  /** Ажилтны дотоод тэмдэглэл — харилцагчид харагдахгүй. */
  note?: string
  createdAt?: string
  updatedAt?: string
}
