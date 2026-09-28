import { useState } from 'react'
import { useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'

import {
  AppHeader,
  FilterChips,
  Screen,
  StateView,
  type FilterChip,
} from '@/components'
import type { UserTakeActionStatus } from '@/data/take-action/take-action-model'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useTakeActionResponses } from '@/hooks/use-take-actions'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { UserResponseCard } from './user-response-card'

type StatusFilter = UserTakeActionStatus | 'ALL'

const statusChips = (): FilterChip<StatusFilter>[] => [
  { value: 'ALL', label: messages.common.all },
  { value: 'waiting', label: messages.takeAction.responseStatuses.waiting },
  { value: 'success', label: messages.takeAction.responseStatuses.success },
]

/** Вэбийн "Хэрэглэгчийн хариу" (`/portal/take-action/user-take-action-list`)
 * — асуумж сонгохгүйгээр бөглөсөн бүх хариуг харна. */
export function TakeActionAllResponsesScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const [status, setStatus] = useState<StatusFilter>('ALL')

  const query = useTakeActionResponses({
    status: status === 'ALL' ? undefined : status,
  })

  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.takeAction.allResponsesTitle}
        leading={
          openDrawer
            ? {
                icon: 'menu',
                label: messages.nav.openMenu,
                onPress: openDrawer,
              }
            : {
                icon: 'back',
                label: messages.nav.back,
                onPress: () => router.back(),
              }
        }
        actions={[
          {
            icon: 'refresh',
            label: messages.common.refresh,
            onPress: () => query.refetch(),
          },
        ]}
      />

      <View className="pb-3">
        <FilterChips
          chips={statusChips()}
          value={status}
          onChange={setStatus}
        />
      </View>

      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={items.length === 0}
        emptyIcon="takeAction"
        emptyLabel={messages.takeAction.emptyResponses}
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={items}
          keyExtractor={(item, index) =>
            `${item.uid}-${item.takeActionId}-${index}`
          }
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          refreshing={refresh.refreshing}
          onRefresh={refresh.onRefresh}
          renderItem={({ item }) => <UserResponseCard response={item} />}
        />
      </StateView>
    </Screen>
  )
}
