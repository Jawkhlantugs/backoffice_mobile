import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supportTicketRepository } from '@/data/support-ticket/support-ticket-repository'
import type { TicketStatus } from '@/data/support-ticket/support-ticket-model'

const PAGE_SIZE = 20

export const ticketQueryKeys = {
  all: ['support-tickets'] as const,
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

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: ticketQueryKeys.detail(id),
    queryFn: () => supportTicketRepository.byId(id),
    enabled: id.length > 0,
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      supportTicketRepository.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ticketQueryKeys.all })
    },
  })
}
