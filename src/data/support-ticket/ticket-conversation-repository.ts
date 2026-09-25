import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toTicketMessage,
  type TicketMessageDto,
} from './ticket-conversation-dto'
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
      ...(params.page ? { page: params.page } : {}),
      ...(params.pageSize ? { pageSize: params.pageSize } : {}),
      ...(params.lastEvaluatedKey
        ? { lastEvaluatedKey: params.lastEvaluatedKey }
        : {}),
    })

    const page = unwrapList<TicketMessageDto>(
      response.data,
      'ticket-conversation',
    )
    return { ...page, items: page.items.map(toTicketMessage) }
  },
}
