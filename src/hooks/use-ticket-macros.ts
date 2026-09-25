import { useQuery } from '@tanstack/react-query'

import { ticketMacroRepository } from '@/data/support-ticket/ticket-macro-repository'

export function useTicketMacros() {
  return useQuery({
    queryKey: ['ticket-macros'],
    queryFn: () => ticketMacroRepository.list(),
    staleTime: 5 * 60 * 1000,
  })
}
