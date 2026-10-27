import type { SupportTicket, TicketStatus } from './support-ticket-model'

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
  file?: string
  ticket_message?: string
  ticketMessage?: string
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

const KNOWN_STATUSES: TicketStatus[] = ['new', 'open', 'pending', 'solved']

function toStatus(raw: string | undefined): TicketStatus {
  return KNOWN_STATUSES.find((status) => status === raw) ?? 'new'
}

/** Вэбийн `getVisibleTicketNote`: Zendesk-ээс импортолсон JSON тэмдэглэлийг нуух. */
function visibleNote(raw: string | undefined): string | undefined {
  const note = raw?.trim()
  if (!note) return undefined
  try {
    const parsed = JSON.parse(note) as {
      source?: unknown
      zendesk_ticket_id?: unknown
    }
    if (parsed.source === 'zendesk' && parsed.zendesk_ticket_id) {
      return undefined
    }
  } catch {
    return note
  }
  return note
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

/** Вэбийн `support/tickets/index.tsx`-ийн `uid` — дараалал нь яг тэр. */
function customerUid(dto: SupportTicketDto): string | undefined {
  const top = dto.uid ?? dto.user_id ?? dto.userId
  if (top || typeof dto.user !== 'object') return top
  return dto.user?.uid ?? dto.user?.user_id ?? dto.user?.userId ?? dto.user?.id
}

export function toSupportTicket(dto: SupportTicketDto): SupportTicket {
  return {
    id: dto.id ?? '',
    title: dto.title ?? '',
    requesterLabel: requesterLabel(dto),
    requesterId: requesterId(dto),
    customerUid: customerUid(dto),
    status: toStatus(dto.status),
    priority: dto.priority || undefined,
    assignee: dto.agent?.email ?? dto.assignee,
    categoryLabel: dto.category?.categoryNameMn ?? dto.category?.categoryNameEn,
    ticketMessage:
      (dto.ticket_message ?? dto.ticketMessage)?.trim() || undefined,
    file: dto.file?.trim() || undefined,
    note: visibleNote(dto.notes),
    createdAt: dto.created_at ?? dto.createdAt,
    updatedAt: dto.updated_at ?? dto.updatedAt,
  }
}
