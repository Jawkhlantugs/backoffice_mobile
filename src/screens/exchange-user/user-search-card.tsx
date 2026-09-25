import { View } from 'react-native'

import { AppCard, AppText, Avatar } from '@/components'
import type { ExchangeUser } from '@/data/exchange-user/exchange-user-model'
import { messages } from '@/lib/messages'

export function UserSearchCard({
  user,
  onPress,
}: {
  user: ExchangeUser
  onPress: () => void
}) {
  return (
    <AppCard onPress={onPress} className="flex-row items-center gap-3">
      <Avatar source={user.email} size="sm" />
      <View className="flex-1 gap-0.5">
        <AppText variant="body" numberOfLines={1} className="font-semibold">
          {user.email}
        </AppText>
        <AppText variant="caption" numberOfLines={1}>
          {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.id}
        </AppText>
      </View>
      {user.kycLevel !== undefined ? (
        <AppText variant="tiny">
          {messages.users.kycLevel} {user.kycLevel}
        </AppText>
      ) : null}
    </AppCard>
  )
}
