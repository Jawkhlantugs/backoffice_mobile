/**
 * Ticket ярианы нэг мессеж. `conversation.send`-ийн WS params-тай ижил
 * талбар (`MOBILE_SCOPE_RESEARCH.md` §2.2) — сервер лүү явсан хэлбэрээрээ
 * буцаж ирнэ гэж үзсэн.
 */
export type TicketMessage = {
  id: string
  ticketId: string
  /** HTML — дэлгэц дээр `stripHtml`-ээр цэвэрлэж харуулна. */
  message: string
  senderId?: string
  senderType?: 'support' | 'user' | string
  createdAt?: string
}
