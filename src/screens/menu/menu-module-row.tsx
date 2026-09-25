import { View } from 'react-native'
import { useRouter } from 'expo-router'

import { AppText, ListRow } from '@/components'
import type { MenuEntry } from '@/core/navigation/menu-view'
import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'

/**
 * Цэсний нэг модуль. Утсан дээр хийгдээгүй мөрийг нуухгүй — вэбтэй ижил
 * жагсаалт харагдаж, аль нь бэлэн болохыг шошгоор хэлнэ (§1.7).
 */
export function MenuModuleRow({
  entry,
  first,
  last,
}: {
  entry: MenuEntry
  first: boolean
  last: boolean
}) {
  const router = useRouter()
  const route = entry.route

  return (
    <View
      className={cn(
        'border-x border-border bg-card',
        first && 'rounded-t-xl border-t',
        last && 'rounded-b-xl border-b',
      )}
    >
      <ListRow
        title={entry.label}
        icon={entry.icon}
        divider={!first}
        onPress={route === null ? undefined : () => router.push(route)}
        trailing={
          route === null ? (
            <View className="rounded-md bg-muted px-1.5 py-0.5">
              <AppText variant="tiny" className="uppercase">
                {messages.nav.webOnly}
              </AppText>
            </View>
          ) : undefined
        }
      />
    </View>
  )
}
