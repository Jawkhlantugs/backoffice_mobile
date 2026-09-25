import type { TicketMessage } from './ticket-conversation-model'

export type TicketMessageDto = {
  id?: string
  uid?: string
  ticketId?: string
  message?: string
  content?: string
  senderId?: string
  senderType?: string
  createdAt?: string
  created_at?: string
  timestamp?: number
}

export function toTicketMessage(dto: TicketMessageDto): TicketMessage {
  return {
    id: dto.id ?? dto.uid ?? '',
    ticketId: dto.ticketId ?? '',
    message: dto.message ?? dto.content ?? '',
    senderId: dto.senderId,
    senderType: dto.senderType,
    createdAt: dto.createdAt ?? dto.created_at,
  }
}
