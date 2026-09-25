import { useState } from 'react'
import { useRouter } from 'expo-router'
import { FlatList, View } from 'react-native'

import {
  AppButton,
  AppHeader,
  ConfirmSheet,
  Screen,
  StateView,
} from '@/components'
import type { PushNotification } from '@/data/push-notification/push-notification-model'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import {
  usePushNotifications,
  useUpdatePushNotificationStatus,
} from '@/hooks/use-push-notifications'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { PushNotificationCard } from './push-notification-card'

type Decision = 'PROCESSING' | 'REJECTED'

export function PushNotificationListScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()

  const query = usePushNotifications()
  const updateStatus = useUpdatePushNotificationStatus()
  const refresh = usePullRefresh(() => query.refetch())

  const [target, setTarget] = useState<{
    item: PushNotification
    decision: Decision
  } | null>(null)

  const items = query.data?.items ?? []

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.pushNotifications.title}
        subtitle={messages.pushNotifications.subtitle}
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
        emptyIcon="push"
        emptyLabel={messages.pushNotifications.empty}
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.pid}
          contentContainerClassName="gap-3 pb-28"
          showsVerticalScrollIndicator={false}
          refreshing={refresh.refreshing}
          onRefresh={refresh.onRefresh}
          renderItem={({ item }) => (
            <View className="gap-2">
              <PushNotificationCard item={item} />
              {item.status === 'PENDING' ? (
                <View className="flex-row gap-2">
                  <AppButton
                    label={messages.pushNotifications.approve}
                    size="md"
                    onPress={() => setTarget({ item, decision: 'PROCESSING' })}
                  />
                  <AppButton
                    label={messages.pushNotifications.reject}
                    variant="secondary"
                    size="md"
                    onPress={() => setTarget({ item, decision: 'REJECTED' })}
                  />
                </View>
              ) : null}
            </View>
          )}
        />
      </StateView>

      <View className="absolute inset-x-4 bottom-4">
        <AppButton
          label={messages.pushNotifications.newButton}
          icon="add"
          onPress={() => router.push('/notifications/new')}
        />
      </View>

      <ConfirmSheet
        visible={target !== null}
        title={
          target?.decision === 'REJECTED'
            ? messages.pushNotifications.rejectTitle
            : messages.pushNotifications.approveTitle
        }
        description={target?.item.title ?? ''}
        destructive={target?.decision === 'REJECTED'}
        confirmLabel={
          target?.decision === 'REJECTED'
            ? messages.pushNotifications.reject
            : messages.pushNotifications.approve
        }
        onCancel={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return
          await updateStatus.mutateAsync({
            pid: target.item.pid,
            status: target.decision,
          })
          setTarget(null)
        }}
      />
    </Screen>
  )
}
