import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import { toTicketMacro, type TicketMacroDto } from './ticket-macro-dto'
import type { TicketMacro } from './ticket-macro-model'

/** Endpoint: `support.service.ts` — `POST {backoffice}/support/marcos/list`. */
export const ticketMacroRepository = {
  async list(): Promise<ListPage<TicketMacro>> {
    const response = await clients.backoffice.post('/support/marcos/list', {})
    const page = unwrapList<TicketMacroDto>(response.data, 'ticket-macros')
    return { ...page, items: page.items.map(toTicketMacro) }
  },
}
