import { useState } from 'react'
import { useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'

import {
  AppButton,
  AppHeader,
  FilterChips,
  Screen,
  SegmentedControl,
  StateView,
  type FilterChip,
  useTabBarInset,
} from '@/components'
import type { LeaveStatus } from '@/data/leave-request/leave-request-model'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useSessionStore } from '@/core/session/session-store'
import { useLeaveRequests } from '@/hooks/use-leave-requests'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { LeaveRequestCard } from './leave-request-card'

type Scope = 'mine' | 'review'
type StatusFilter = LeaveStatus | 'ALL'

const STATUS_CHIPS: FilterChip<StatusFilter>[] = [
  { value: 'ALL', label: messages.common.all },
  { value: 'PENDING', label: messages.leave.statuses.PENDING },
  { value: 'APPROVED', label: messages.leave.statuses.APPROVED },
  { value: 'REJECTED', label: messages.leave.statuses.REJECTED },
]

/** Хөвөгч товч (h-12) + зай. */
const FAB_SPACE = 64

export function LeaveListScreen() {
  const tabBarInset = useTabBarInset()
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const userId = useSessionStore((store) => store.user?.id)
  const [scope, setScope] = useState<Scope>('review')
  const [status, setStatus] = useState<StatusFilter>('PENDING')

  const query = useLeaveRequests({
    status: status === 'ALL' ? undefined : status,
    adminUserId: scope === 'mine' ? userId : undefined,
  })

  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.leave.title}
        subtitle={messages.tabs.work}
        leading={
          openDrawer
            ? {
                icon: 'menu',
                label: messages.nav.openMenu,
                onPress: openDrawer,
              }
            : undefined
        }
        actions={[
          {
            icon: 'refresh',
            label: messages.common.refresh,
            onPress: () => query.refetch(),
          },
        ]}
      />

      <View className="gap-3 pb-3">
        <SegmentedControl<Scope>
          value={scope}
          onChange={setScope}
          options={[
            { value: 'review', label: messages.leave.toReview, icon: 'check' },
            { value: 'mine', label: messages.leave.mine, icon: 'profile' },
          ]}
        />

        <FilterChips chips={STATUS_CHIPS} value={status} onChange={setStatus} />
      </View>

      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={items.length === 0}
        emptyIcon="leave"
        emptyLabel={messages.leave.empty}
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3"
          // Таб bar + хөвөгч "Шинэ хүсэлт" товчны өндөр.
          contentContainerStyle={{ paddingBottom: tabBarInset + FAB_SPACE }}
          showsVerticalScrollIndicator={false}
          refreshing={refresh.refreshing}
          onRefresh={refresh.onRefresh}
          renderItem={({ item }) => (
            <LeaveRequestCard
              request={item}
              onPress={() => router.push(`/leave/${item.id}`)}
            />
          )}
        />
      </StateView>

      <View className="absolute inset-x-4" style={{ bottom: tabBarInset }}>
        <AppButton
          label={messages.leave.newRequest}
          icon="add"
          onPress={() => router.push('/leave/new')}
        />
      </View>
    </Screen>
  )
}
