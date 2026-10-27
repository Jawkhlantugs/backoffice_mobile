import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'

import type { ListPage } from '@/core/network/envelope'
import { supportTicketRepository } from '@/data/support-ticket/support-ticket-repository'
import type {
  SupportTicket,
  TicketStatus,
} from '@/data/support-ticket/support-ticket-model'
import { messages } from '@/lib/messages'

const PAGE_SIZE = 20

export const ticketQueryKeys = {
  all: ['support-tickets'] as const,
  lists: ['support-tickets', 'list'] as const,
  list: (status?: TicketStatus, search?: string) =>
    ['support-tickets', 'list', status ?? 'all', search ?? ''] as const,
  detail: (id: string) => ['support-tickets', 'detail', id] as const,
}

export function useSupportTickets(options: {
  status?: TicketStatus
  search?: string
}) {
  const { status, search } = options

  return useQuery({
    queryKey: ticketQueryKeys.list(status, search),
    queryFn: () =>
      supportTicketRepository.list({
        page: 1,
        pageSize: PAGE_SIZE,
        status,
        search,
      }),
  })
}

function findListedTicket(
  queryClient: QueryClient,
  id: string,
): SupportTicket | undefined {
  const pages = queryClient.getQueriesData<ListPage<SupportTicket>>({
    queryKey: ticketQueryKeys.lists,
  })
  for (const [, page] of pages) {
    const ticket = page?.items.find((item) => item.id === id)
    if (ticket) return ticket
  }
  return undefined
}

// ⚠️ `GET /support/tickets/{id}` нь харилцагчийн `x-support-key` шаарддаг —
// админ token-оор 401 өгч session-ийг унагаана. Вэб ч жагсаалтын мөрөөс нээдэг.
export function useSupportTicket(id: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ticketQueryKeys.detail(id),
    queryFn: () => {
      const ticket = findListedTicket(queryClient, id)
      if (!ticket) throw new Error(messages.supportTickets.notInList)
      return ticket
    },
    enabled: id.length > 0,
    retry: false,
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      supportTicketRepository.updateStatus(id, status),
    onSuccess: (_ticket, { id, status }) => {
      // Дэлгэрэнгүй нь жагсаалтын cache-ээс уншдаг — шууд шинэчилнэ.
      queryClient.setQueryData<SupportTicket>(
        ticketQueryKeys.detail(id),
        (current) => (current ? { ...current, status } : current),
      )
      void queryClient.invalidateQueries({ queryKey: ticketQueryKeys.lists })
    },
  })
}
