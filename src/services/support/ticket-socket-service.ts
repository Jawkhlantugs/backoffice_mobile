import { api } from '@/core/config/api'
import { clients } from '@/core/network/clients'
import { unwrapObject } from '@/core/network/envelope'

/**
 * Ticket яриа явуулах WebSocket. Гадаад ертөнцтэй харьцах цэвэр функцууд —
 * холболтын амьдралын мөчлөг (нээх/хаах, AppState) hook (`use-ticket-conversation.ts`)-д.
 *
 * `MOBILE_SCOPE_RESEARCH.md` §2.2: `POST {socket}/ws/token` → түр token →
 * `wss://…?token=` холбогдоод `conversation.send` илгээнэ.
 */

const PING_INTERVAL_MS = 25_000
const OPEN_TIMEOUT_MS = 5_000

export async function fetchTicketWsToken(): Promise<string> {
  const response = await clients.socket.post('/ws/token', {})
  const body = unwrapObject<{ token?: string }>(response.data, 'ws-token')
  if (!body.token) throw new Error('WS token хариунд алга')
  return body.token
}

export function ticketWsUrl(token: string): string {
  return `${api.ws}?token=${encodeURIComponent(token)}`
}

// Heartbeat нь `action` түлхүүртэй — `method` бол зөвхөн `conversation.send`.
export function pingMessage(): string {
  return JSON.stringify({ action: 'ping' })
}

export function pongMessage(): string {
  return JSON.stringify({ action: 'pong' })
}

/** Серверийн heartbeat — вэбийн адил `type`/`action`/`method`-ын аль нь ч байж болно. */
export function isPingMessage(raw: unknown): boolean {
  if (typeof raw !== 'string') return false
  try {
    const payload = JSON.parse(raw) as {
      type?: unknown
      action?: unknown
      method?: unknown
    }
    const kind = payload.type ?? payload.action ?? payload.method
    return String(kind ?? '').toLowerCase() === 'ping'
  } catch {
    return false
  }
}

/** `new WebSocket()` нь CONNECTING төлөвтэй буцдаг — нээгдэх хүртэл хүлээнэ. */
export function waitForOpen(
  socket: WebSocket,
  timeoutMs: number,
): Promise<void> {
  if (socket.readyState === WebSocket.OPEN) return Promise.resolve()
  if (socket.readyState !== WebSocket.CONNECTING) {
    return Promise.reject(new Error('WS холбогдоогүй'))
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer)
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('error', onFail)
      socket.removeEventListener('close', onFail)
    }
    const onOpen = () => {
      cleanup()
      resolve()
    }
    const onFail = () => {
      cleanup()
      reject(new Error('WS холболт амжилтгүй'))
    }
    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('WS холболтын хугацаа дууслаа'))
    }, timeoutMs)

    socket.addEventListener('open', onOpen)
    socket.addEventListener('error', onFail)
    socket.addEventListener('close', onFail)
  })
}

export type ConversationSendParams = {
  ticketId: string
  message: string
  senderId: string
  uid?: string
  attachments?: string[]
}

export function conversationSendMessage(
  params: ConversationSendParams,
): string {
  return JSON.stringify({
    method: 'conversation.send',
    params: {
      ticketId: params.ticketId,
      message: params.message,
      senderId: params.senderId,
      senderType: 'support',
      attachments: params.attachments ?? [],
      ...(params.uid ? { uid: params.uid } : {}),
    },
  })
}

export const TICKET_WS_PING_INTERVAL_MS = PING_INTERVAL_MS
export const TICKET_WS_OPEN_TIMEOUT_MS = OPEN_TIMEOUT_MS
