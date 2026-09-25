import { View } from 'react-native'

import { AppCard, AppIcon, AppText, StatusPill } from '@/components'
import type { PushNotification } from '@/data/push-notification/push-notification-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

const TONES = {
  PENDING: 'warning',
  PROCESSING: 'info',
  DONE: 'success',
  REJECTED: 'danger',
} as const

export function PushNotificationCard({
  item,
  onPress,
}: {
  item: PushNotification
  onPress?: () => void
}) {
  return (
    <AppCard onPress={onPress} className="gap-2">
      <View className="flex-row items-start gap-3">
        <AppIcon name="push" size={iconSize.md} tone="muted" />
        <View className="flex-1 gap-0.5">
          <AppText variant="body" numberOfLines={1} className="font-semibold">
            {item.title}
          </AppText>
          <AppText variant="caption" numberOfLines={2}>
            {item.message}
          </AppText>
        </View>
        <StatusPill
          label={messages.pushNotifications.statuses[item.status]}
          tone={TONES[item.status]}
        />
      </View>

      <View className="flex-row items-center justify-between">
        <AppText variant="tiny">{formatDate(item.createTime)}</AppText>
        <AppText variant="tiny">
          {item.isBroadcast
            ? messages.pushNotifications.form.broadcast
            : (item.approvedUser ?? '')}
        </AppText>
      </View>
    </AppCard>
  )
}
