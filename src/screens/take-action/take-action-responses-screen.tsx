import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'

import {
  AppHeader,
  FilterChips,
  Screen,
  StateView,
  type FilterChip,
} from '@/components'
import type { UserTakeActionStatus } from '@/data/take-action/take-action-model'
import { useTakeActionResponses } from '@/hooks/use-take-actions'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { UserResponseCard } from './user-response-card'

type StatusFilter = UserTakeActionStatus | 'ALL'

const STATUS_CHIPS: FilterChip<StatusFilter>[] = [
  { value: 'ALL', label: messages.common.all },
  { value: 'waiting', label: messages.takeAction.responseStatuses.waiting },
  { value: 'success', label: messages.takeAction.responseStatuses.success },
]

export function TakeActionResponsesScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [status, setStatus] = useState<StatusFilter>('ALL')

  const query = useTakeActionResponses({
    takeActionId: id,
    status: status === 'ALL' ? undefined : status,
  })

  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.takeAction.responsesTitle}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
        actions={[
          {
            icon: 'refresh',
            label: messages.common.refresh,
            onPress: () => query.refetch(),
          },
        ]}
      />

      <View className="pb-3">
        <FilterChips chips={STATUS_CHIPS} value={status} onChange={setStatus} />
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
          keyExtractor={(item, index) => `${item.uid}-${index}`}
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
