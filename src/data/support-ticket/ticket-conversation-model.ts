import type { SupportTicket } from './support-ticket-model'

/**
 * Ticket ярианы нэг мессеж. Вэбийн `ChatMessage`-ийн адил илгээгчийг
 * харилцагч / ажилтан гэж хоёр ангилна.
 */
export type TicketMessage = {
  id: string
  ticketId: string
  /** HTML — дэлгэц дээр `stripHtml`-ээр цэвэрлэж харуулна. */
  message: string
  senderId?: string
  /** Вэб: `user`/`customer` бол харилцагч, бусад нь ажилтан. */
  fromCustomer: boolean
  /** ISO string эсвэл unix (сек/мс) — `formatDate` хоёуланг нь уншина. */
  createdAt?: string | number
}

/** Вэбийн адил тасалбарын `ticketMessage` нь ярианы эхний, харилцагчийн мөр. */
export function openingMessage(ticket: SupportTicket): TicketMessage | null {
  if (!ticket.ticketMessage) return null
  return {
    id: `${ticket.id}-opening`,
    ticketId: ticket.id,
    message: ticket.ticketMessage,
    fromCustomer: true,
    createdAt: ticket.createdAt,
  }
}

export const LOCAL_MESSAGE_PREFIX = 'local-'

function timestampOf(value: TicketMessage['createdAt']): number {
  if (value === undefined) return Number.NaN
  if (typeof value === 'number') return value <= 1e12 ? value * 1000 : value
  return Date.parse(value)
}

/** Сервер ба WS-ийн цаг хэдэн секундээр зөрж болно (Flutter-ийн хослолын шалгалт). */
const SAME_MESSAGE_WINDOW_MS = 60_000

function isSameMessage(a: TicketMessage, b: TicketMessage): boolean {
  if (a.fromCustomer !== b.fromCustomer || a.message !== b.message) return false
  const gap = Math.abs(timestampOf(a.createdAt) - timestampOf(b.createdAt))
  return Number.isNaN(gap) || gap < SAME_MESSAGE_WINDOW_MS
}

/**
 * REST + WS + илгээсэн (optimistic) мессежийг нэгтгэж цагаар эрэмбэлнэ.
 * WS/optimistic мөр серверээс ижил мессеж ирмэгц арилна — давхардахгүй.
 */
export function mergeConversation(
  fetched: TicketMessage[],
  live: TicketMessage[],
): TicketMessage[] {
  const ids = new Set<string>()
  const merged: TicketMessage[] = []

  for (const message of fetched) {
    if (message.id && ids.has(message.id)) continue
    if (message.id) ids.add(message.id)
    merged.push(message)
  }
  for (const message of live) {
    if (message.id && ids.has(message.id)) continue
    if (merged.some((other) => isSameMessage(other, message))) continue
    if (message.id) ids.add(message.id)
    merged.push(message)
  }

  return merged
    .map((message, index) => ({
      message,
      index,
      time: timestampOf(message.createdAt),
    }))
    .sort((a, b) => {
      const aMissing = Number.isNaN(a.time)
      const bMissing = Number.isNaN(b.time)
      if (aMissing || bMissing) {
        return aMissing === bMissing ? a.index - b.index : aMissing ? 1 : -1
      }
      return a.time - b.time || a.index - b.index
    })
    .map(({ message }) => message)
}
