import { clients } from '@/core/network/clients'
import { unwrap, unwrapList, type ListPage } from '@/core/network/envelope'

import { toSupportTicket, type SupportTicketDto } from './support-ticket-dto'
import type { SupportTicket, TicketStatus } from './support-ticket-model'

/**
 * Endpoint: вэб админы `support.service.ts`. Offset pagination
 * (`page`/`pageSize`, хариунд `total`).
 */

export type TicketListParams = {
  page: number
  pageSize: number
  status?: TicketStatus
  search?: string
}

export const supportTicketRepository = {
  async list(params: TicketListParams): Promise<ListPage<SupportTicket>> {
    const response = await clients.backoffice.post('/support/tickets/list', {
      page: params.page,
      pageSize: params.pageSize,
      ...(params.status ? { status: params.status } : {}),
      ...(params.search ? { search: params.search } : {}),
    })

    const page = unwrapList<SupportTicketDto>(response.data, 'support-tickets')
    return { ...page, items: page.items.map(toSupportTicket) }
  },

  async byId(id: string): Promise<SupportTicket> {
    const response = await clients.backoffice.get(`/support/tickets/${id}`)
    return toSupportTicket(unwrap<SupportTicketDto>(response.data))
  },

  /** Статус солих — `PUT {backoffice}/support/tickets/{id}`, хариу дахин уншиж холино. */
  async updateStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
    const response = await clients.backoffice.put(`/support/tickets/${id}`, {
      status,
    })
    return toSupportTicket(unwrap<SupportTicketDto>(response.data))
  },
}
