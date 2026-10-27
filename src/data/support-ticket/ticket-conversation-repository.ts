import { clients } from '@/core/network/clients'
import type { ListPage } from '@/core/network/envelope'
import { decodeCursor } from '@/data/shared/cursor'

import { toConversationPage, toTicketMessage } from './ticket-conversation-dto'
import type { TicketMessage } from './ticket-conversation-model'

/**
 * Endpoint: `support.service.ts` — `POST {support}admin/tickets/conversation`.
 * `api.support` (`{BASE}/support/support-ticket/`) trailing slash-той тул
 * зам эхэнд `/` бичихгүй (davхар slash-аас сэргийлнэ).
 */
export type ConversationListParams = {
  ticketId: string
  page?: number
  pageSize?: number
  lastEvaluatedKey?: string
}

export const ticketConversationRepository = {
  async list(params: ConversationListParams): Promise<ListPage<TicketMessage>> {
    const response = await clients.support.post('admin/tickets/conversation', {
      ticketId: params.ticketId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      ...(params.lastEvaluatedKey
        ? { lastEvaluatedKey: decodeCursor(params.lastEvaluatedKey) }
        : {}),
    })

    const page = toConversationPage(response.data)
    return { ...page, items: page.items.map(toTicketMessage) }
  },
}
