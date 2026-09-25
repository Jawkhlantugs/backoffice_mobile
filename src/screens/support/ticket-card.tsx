import { View } from 'react-native'

import { AppCard, AppIcon, AppText } from '@/components'
import type { SupportTicket } from '@/data/support-ticket/support-ticket-model'
import { formatDate } from '@/lib/date'
import { iconSize } from '@/theme/tokens'

import { TicketStatusPill } from './ticket-status-pill'

export function TicketCard({
  ticket,
  onPress,
}: {
  ticket: SupportTicket
  onPress: () => void
}) {
  return (
    <AppCard onPress={onPress} className="gap-3">
      <View className="flex-row items-start gap-3">
        <AppIcon name="ticket" size={iconSize.md} tone="muted" />

        <View className="flex-1 gap-0.5">
          <AppText variant="body" numberOfLines={1} className="font-semibold">
            {ticket.title}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {ticket.requesterLabel}
          </AppText>
        </View>

        <TicketStatusPill status={ticket.status} />
      </View>

      <View className="flex-row items-center gap-2">
        {ticket.categoryLabel ? (
          <AppText variant="tiny" className="flex-1" numberOfLines={1}>
            {ticket.categoryLabel}
          </AppText>
        ) : (
          <View className="flex-1" />
        )}
        <AppText variant="tiny">{formatDate(ticket.createdAt)}</AppText>
      </View>
    </AppCard>
  )
}
