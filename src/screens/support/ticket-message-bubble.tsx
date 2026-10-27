import { View } from 'react-native'

import { AppText, Avatar } from '@/components'
import type { TicketMessage } from '@/data/support-ticket/ticket-conversation-model'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/date'
import { stripHtml } from '@/lib/html'
import { messages } from '@/lib/messages'

/** Вэбийн яриатай ижил: харилцагч зүүн талд, ажилтан баруун талд аватартай. */
export function TicketMessageBubble({
  message,
  customerLabel,
}: {
  message: TicketMessage
  /** Харилцагчийн имэйл — аватарын үсэг. */
  customerLabel: string
}) {
  const fromCustomer = message.fromCustomer

  return (
    <View
      className={cn(
        'flex-row items-start gap-2',
        fromCustomer ? 'justify-start' : 'justify-end',
      )}
    >
      {fromCustomer ? <Avatar source={customerLabel} size="sm" /> : null}

      <View
        className={cn(
          'max-w-[80%] gap-1 rounded-lg border border-border px-3 py-2',
          fromCustomer
            ? 'rounded-tl-none bg-card'
            : 'rounded-tr-none bg-secondary',
        )}
      >
        <AppText variant="body" className="text-foreground" selectable>
          {stripHtml(message.message)}
        </AppText>
        <AppText variant="tiny">
          {formatRelativeTime(message.createdAt)}
        </AppText>
      </View>

      {fromCustomer ? null : (
        <Avatar source={messages.supportTickets.agentInitials} size="sm" />
      )}
    </View>
  )
}
