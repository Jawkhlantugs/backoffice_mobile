import { View } from 'react-native'

import { AppCard, AppText, Badge } from '@/components'
import { messages } from '@/lib/messages'

/** Демо горимд Нүүрийн дээд хэсэгт — зохиомол өгөгдөл гэдгийг андуурахгүй. */
export function DemoNotice() {
  return (
    <AppCard className="gap-1 border-warning bg-warning-subtle">
      <View className="flex-row items-center gap-2">
        <Badge value={messages.demo.badge} tone="warning" />
        <AppText variant="body" className="font-semibold">
          {messages.demo.title}
        </AppText>
      </View>
      <AppText variant="caption">{messages.demo.description}</AppText>
    </AppCard>
  )
}
