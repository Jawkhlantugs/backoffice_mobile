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

export async function fetchTicketWsToken(): Promise<string> {
  const response = await clients.socket.post('/ws/token', {})
  const body = unwrapObject<{ token?: string }>(response.data, 'ws-token')
  if (!body.token) throw new Error('WS token хариунд алга')
  return body.token
}

export function ticketWsUrl(token: string): string {
  return `${api.ws}?token=${encodeURIComponent(token)}`
}

export function pingMessage(): string {
  return JSON.stringify({ method: 'ping' })
}

export type ConversationSendParams = {
  ticketId: string
  message: string
  senderId: string
  uid?: string
  attachments?: string[]
}

export function conversationSendMessage(params: ConversationSendParams): string {
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
