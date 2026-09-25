import type {
  SupportTicket,
  TicketPriority,
  TicketStatus,
} from './support-ticket-model'

/**
 * Серверийн JSON. `xmeta-admin`-ийн `support.types.ts`-ийн `Ticket`-тэй ижил
 * — талбар бүр хэд хэдэн боломжит нэртэй (backend-ийн жигд бус байдал,
 * FLOWS.md §5). Энэ файлаас цааш гарахгүй.
 */
export type SupportTicketDto = {
  id?: string
  title?: string
  user?:
    | string
    | {
        email?: string
        id?: string
        user_id?: string
        userId?: string
        uid?: string
      }
  user_id?: string
  userId?: string
  uid?: string
  status?: string
  priority?: string
  assignee?: string
  agent?: { email?: string; id?: string }
  agent_id?: string
  agentId?: string
  category?: { categoryNameMn?: string; categoryNameEn?: string }
  notes?: string
  ticket_message?: string
  ticketMessage?: string
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

const KNOWN_STATUSES: TicketStatus[] = ['new', 'open', 'pending', 'solved']
const KNOWN_PRIORITIES: TicketPriority[] = ['high', 'medium', 'low']

function toStatus(raw: string | undefined): TicketStatus {
  return KNOWN_STATUSES.find((status) => status === raw) ?? 'new'
}

function toPriority(raw: string | undefined): TicketPriority | undefined {
  return KNOWN_PRIORITIES.find((priority) => priority === raw)
}

function requesterLabel(dto: SupportTicketDto): string {
  if (typeof dto.user === 'string' && dto.user.length > 0) return dto.user
  if (typeof dto.user === 'object' && dto.user?.email) return dto.user.email
  return dto.userId ?? dto.user_id ?? dto.uid ?? ''
}

function requesterId(dto: SupportTicketDto): string | undefined {
  if (typeof dto.user === 'object') {
    return (
      dto.user?.id ?? dto.user?.user_id ?? dto.user?.userId ?? dto.user?.uid
    )
  }
  return dto.userId ?? dto.user_id ?? dto.uid
}

export function toSupportTicket(dto: SupportTicketDto): SupportTicket {
  return {
    id: dto.id ?? '',
    title: dto.title ?? '',
    requesterLabel: requesterLabel(dto),
    requesterId: requesterId(dto),
    status: toStatus(dto.status),
    priority: toPriority(dto.priority),
    assignee: dto.agent?.email ?? dto.assignee,
    categoryLabel: dto.category?.categoryNameMn ?? dto.category?.categoryNameEn,
    message: dto.notes ?? dto.ticket_message ?? dto.ticketMessage,
    createdAt: dto.created_at ?? dto.createdAt,
    updatedAt: dto.updated_at ?? dto.updatedAt,
  }
}
