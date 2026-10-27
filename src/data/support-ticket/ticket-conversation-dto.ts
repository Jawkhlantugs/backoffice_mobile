import type { ListPage } from '@/core/network/envelope'
import { encodeCursor } from '@/data/shared/cursor'

import type { TicketMessage } from './ticket-conversation-model'

/**
 * Вэбийн `support/utils/helper-functions.ts` `mapConversationToMessage`-тэй
 * ижил — талбар бүр хэд хэдэн нэртэй ирдэг.
 */
export type TicketMessageDto = {
  id?: string | number
  uid?: string
  ticketId?: string
  ticket_id?: string
  /** WS-ийн ticket түлхүүр — `<ticketId>_tk`. */
  tchId?: string
  tch_id?: string
  message?: string
  text?: string
  content?: string
  senderId?: string
  senderType?: string
  sender_type?: string
  sender?: { type?: string }
  createdAt?: string
  created_at?: string
  date?: string
  timestamp?: number | string
  time?: string
  sentAt?: string
  sent_at?: string
  /** Хэрэглэгчийн апп WS-ээр `sendAt`/`epochTime` (unix) явуулдаг. */
  sendAt?: number | string
  send_at?: number | string
  epochTime?: number | string
  epoch_time?: number | string
}

const CUSTOMER_SENDER_TYPES = ['user', 'customer', 'end_user', 'end-user']

type ConversationBag = {
  items?: unknown
  list?: unknown
  total?: unknown
  lastEvaluatedKey?: unknown
}

type ConversationResponse = ConversationBag & {
  body?: ConversationBag
  data?: ConversationBag
}

// ⚠️ `unwrap` биш: support service `data`-аас өмнө `body`-г уншдаг бөгөөд
// envelope `code`-ийг вэб шалгадаггүй — `unwrap` энд хоосон/алдаа буцаана.
export function toConversationPage(
  payload: unknown,
): ListPage<TicketMessageDto> {
  const raw = (payload ?? {}) as ConversationResponse
  const list =
    raw.body?.items ??
    raw.body?.list ??
    raw.data?.items ??
    raw.data?.list ??
    raw.items ??
    raw.list
  const items = Array.isArray(list) ? (list as TicketMessageDto[]) : []
  const total = raw.body?.total ?? raw.data?.total ?? raw.total
  const lastEvaluatedKey =
    raw.body?.lastEvaluatedKey ??
    raw.data?.lastEvaluatedKey ??
    raw.lastEvaluatedKey

  return {
    items,
    total: typeof total === 'number' ? total : items.length,
    lastEvaluatedKey: encodeCursor(lastEvaluatedKey),
  }
}

export function toTicketMessage(dto: TicketMessageDto): TicketMessage {
  const senderType = (
    dto.senderType ??
    dto.sender_type ??
    dto.sender?.type ??
    ''
  ).toLowerCase()

  return {
    id: String(dto.id ?? dto.uid ?? ''),
    ticketId: dto.ticketId ?? '',
    message: dto.message ?? dto.text ?? dto.content ?? '',
    senderId: dto.senderId,
    fromCustomer: CUSTOMER_SENDER_TYPES.includes(senderType),
    createdAt:
      dto.created_at ??
      dto.createdAt ??
      dto.date ??
      dto.timestamp ??
      dto.time ??
      dto.sentAt ??
      dto.sent_at ??
      dto.sendAt ??
      dto.send_at ??
      dto.epochTime ??
      dto.epoch_time,
  }
}

type Frame = Record<string, unknown>

function asFrame(value: unknown): Frame | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Frame)
    : undefined
}

function frames(values: unknown[]): Frame[] {
  return values.map(asFrame).filter((value): value is Frame => !!value)
}

/**
 * Сервер → клиент frame-ийн мессежүүд. Вэб админ болон хэрэглэгчийн апп
 * (`support-ticket-ws.ts`, Flutter `SupportController`) уншдаг бүх хэлбэр.
 */
function wsItems(payload: unknown): Frame[] {
  if (Array.isArray(payload)) return frames(payload)
  const root = asFrame(payload)
  if (!root) return []

  const boxes = [root, root.data, root.params, root.payload].map(asFrame)
  for (const box of boxes) {
    for (const key of ['list', 'items', 'messages']) {
      if (Array.isArray(box?.[key])) return frames(box[key] as unknown[])
    }
  }
  for (const key of ['data', 'body', 'message', 'payload']) {
    if (Array.isArray(root[key])) return frames(root[key] as unknown[])
  }
  // Ticket түлхүүр frame-ийн root дээр ирж болно. `id` нь JSON-RPC хүсэлтийн
  // дугаар тул мессеж рүү хуулахгүй — эс бөгөөс өөр мессежүүд нэгдэнэ.
  for (const key of ['params', 'payload', 'data', 'body', 'item']) {
    const inner = asFrame(root[key])
    if (inner) {
      return [{ ticketId: root.ticketId, tchId: root.tchId, ...inner }]
    }
  }
  return [root]
}

/** Вэбийн `resolveConversationTicketId`. */
function wsTicketId(item: TicketMessageDto): string {
  const tchId = item.tchId ?? item.tch_id
  if (tchId) return String(tchId).replace(/_tk$/i, '')
  return String(item.ticketId ?? item.ticket_id ?? '')
}

function frameMethod(root: Frame): string {
  const route = asFrame(root.websocket)?.route
  return String(root.method ?? route ?? root.action ?? root.type ?? '')
    .trim()
    .toLowerCase()
}

export type SocketFrame = {
  /** `conversation.send` — серверийн жагсаалтыг дахин татах шалтгаан. */
  isNewMessage: boolean
  /** Энэ ticket-ийн, текст бүхий мессежүүд. */
  messages: TicketMessage[]
}

/**
 * WS frame-ийг задална. Огноогүй мессежид хүлээн авсан цагийг өгнө — вэбийн
 * `receivedAt`-тай ижил. JSON биш бол `null`.
 */
export function readSocketFrame(
  raw: unknown,
  ticketId: string,
  receivedAt: string = new Date().toISOString(),
): SocketFrame | null {
  if (typeof raw !== 'string') return null
  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    return null
  }

  const messages = wsItems(payload)
    .filter((item) => wsTicketId(item as TicketMessageDto) === ticketId)
    .map((item) => {
      const message = toTicketMessage(item as TicketMessageDto)
      return { ...message, createdAt: message.createdAt ?? receivedAt }
    })
    .filter((message) => message.message.length > 0)

  const root = asFrame(payload)
  const isNewMessage =
    messages.length > 0 ||
    (root ? frameMethod(root) === 'conversation.send' : false)

  return { isNewMessage, messages }
}
