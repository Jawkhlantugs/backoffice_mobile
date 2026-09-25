import { useRouter } from 'expo-router'
import { FlatList } from 'react-native'

import { AppHeader, Screen, StateView } from '@/components'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useTakeActions } from '@/hooks/use-take-actions'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { TakeActionCard } from './take-action-card'

export function TakeActionListScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const query = useTakeActions()

  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.takeAction.title}
        subtitle={messages.takeAction.listSubtitle}
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

      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={items.length === 0}
        emptyIcon="takeAction"
        emptyLabel={messages.takeAction.empty}
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.actionId}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          refreshing={refresh.refreshing}
          onRefresh={refresh.onRefresh}
          renderItem={({ item }) => (
            <TakeActionCard
              action={item}
              onPress={() => router.push(`/take-action/${item.actionId}`)}
            />
          )}
        />
      </StateView>
    </Screen>
  )
}
