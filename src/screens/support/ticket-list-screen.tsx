import { useState } from 'react'
import { useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'

import {
  AppHeader,
  FilterChips,
  Screen,
  SearchInput,
  StateView,
  type FilterChip,
} from '@/components'
import type { TicketStatus } from '@/data/support-ticket/support-ticket-model'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useSupportTickets } from '@/hooks/use-support-tickets'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { TicketCard } from './ticket-card'

type StatusFilter = TicketStatus | 'ALL'

const statusChips = (): FilterChip<StatusFilter>[] => [
  { value: 'ALL', label: messages.common.all },
  { value: 'new', label: messages.supportTickets.statuses.new },
  { value: 'open', label: messages.supportTickets.statuses.open },
  { value: 'pending', label: messages.supportTickets.statuses.pending },
  { value: 'solved', label: messages.supportTickets.statuses.solved },
]

export function TicketListScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [search, setSearch] = useState('')

  const query = useSupportTickets({
    status: status === 'ALL' ? undefined : status,
    search: search.trim() || undefined,
  })

  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.supportTickets.title}
        subtitle={messages.supportTickets.subtitle}
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

      <View className="gap-3 pb-3">
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder={messages.supportTickets.searchPlaceholder}
        />
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
        emptyIcon="ticket"
        emptyLabel={messages.supportTickets.empty}
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          refreshing={refresh.refreshing}
          onRefresh={refresh.onRefresh}
          renderItem={({ item }) => (
            <TicketCard
              ticket={item}
              onPress={() => router.push(`/support/${item.id}`)}
            />
          )}
        />
      </StateView>
    </Screen>
  )
}
