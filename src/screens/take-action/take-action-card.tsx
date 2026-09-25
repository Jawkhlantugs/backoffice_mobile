import { View } from 'react-native'

import { AppCard, AppIcon, AppText, StatusPill } from '@/components'
import type { TakeAction } from '@/data/take-action/take-action-model'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

export function TakeActionCard({
  action,
  onPress,
}: {
  action: TakeAction
  onPress: () => void
}) {
  return (
    <AppCard onPress={onPress} className="gap-3">
      <View className="flex-row items-start gap-3">
        <AppIcon name="takeAction" size={iconSize.md} tone="muted" />

        <View className="flex-1 gap-0.5">
          <AppText variant="body" numberOfLines={2} className="font-semibold">
            {action.title}
          </AppText>
          {action.type ? (
            <AppText variant="caption" numberOfLines={1}>
              {action.type}
            </AppText>
          ) : null}
        </View>

        <StatusPill
          label={messages.takeAction.statuses[action.status]}
          tone={action.status === 'active' ? 'success' : 'neutral'}
        />
      </View>

      {action.required ? (
        <StatusPill
          label={messages.takeAction.required}
          tone="warning"
          dot={false}
        />
      ) : null}
    </AppCard>
  )
}
