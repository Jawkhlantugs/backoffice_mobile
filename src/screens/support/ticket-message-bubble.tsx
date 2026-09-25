import { View } from 'react-native'

import { AppText } from '@/components'
import type { TicketMessage } from '@/data/support-ticket/ticket-conversation-model'
import { formatDate } from '@/lib/date'
import { stripHtml } from '@/lib/html'
import { cn } from '@/lib/cn'

export function TicketMessageBubble({ message }: { message: TicketMessage }) {
  const fromSupport = message.senderType === 'support'

  return (
    <View
      className={cn(
        'max-w-[85%] gap-1',
        fromSupport ? 'items-end self-end' : 'self-start',
      )}
    >
      <View
        className={cn(
          'rounded-xl px-3 py-2',
          fromSupport ? 'bg-primary' : 'bg-muted',
        )}
      >
        <AppText
          variant="body"
          className={
            fromSupport ? 'text-primary-foreground' : 'text-foreground'
          }
        >
          {stripHtml(message.message)}
        </AppText>
      </View>
      <AppText variant="tiny">{formatDate(message.createdAt)}</AppText>
    </View>
  )
}
