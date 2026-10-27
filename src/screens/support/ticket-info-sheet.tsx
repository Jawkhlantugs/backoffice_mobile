import { View } from 'react-native'

import { BackofficeBottomSheet, InfoRow } from '@/components'
import type { SupportTicket } from '@/data/support-ticket/support-ticket-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

function priorityLabel(priority: string): string {
  const labels: Record<string, string> = messages.supportTickets.priorities
  return labels[priority] ?? priority
}

export function TicketInfoSheet({
  ticket,
  visible,
  onClose,
}: {
  ticket: SupportTicket
  visible: boolean
  onClose: () => void
}) {
  return (
    <BackofficeBottomSheet
      visible={visible}
      title={messages.supportTickets.info}
      onClose={onClose}
    >
      <View className="gap-3">
        <InfoRow
          label={messages.supportTickets.requester}
          value={ticket.requesterLabel}
        />
        {ticket.assignee ? (
          <InfoRow
            label={messages.supportTickets.assignee}
            value={ticket.assignee}
          />
        ) : null}
        {ticket.categoryLabel ? (
          <InfoRow
            label={messages.supportTickets.category}
            value={ticket.categoryLabel}
          />
        ) : null}
        {ticket.priority ? (
          <InfoRow
            label={messages.supportTickets.priority}
            value={priorityLabel(ticket.priority)}
          />
        ) : null}
        <InfoRow
          label={messages.supportTickets.createdAt}
          value={formatDate(ticket.createdAt)}
        />
      </View>
    </BackofficeBottomSheet>
  )
}
