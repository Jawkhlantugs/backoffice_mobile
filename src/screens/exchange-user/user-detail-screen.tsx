import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import { AppHeader, Screen, SegmentedControl, StateView } from '@/components'
import { useExchangeUser } from '@/hooks/use-exchange-users'
import { messages } from '@/lib/messages'

import { UserAssetsTab } from './user-assets-tab'
import { UserBasicTab } from './user-basic-tab'
import { UserSecurityTab } from './user-security-tab'

type Tab = 'basic' | 'assets' | 'security'

export function UserDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const uid = id ?? ''
  const [tab, setTab] = useState<Tab>('basic')

  const query = useExchangeUser(uid)
  const user = query.data

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.users.detailTitle}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
      />

      <StateView
        loading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
      >
        {user ? (
          <View className="flex-1 gap-3">
            <SegmentedControl<Tab>
              value={tab}
              onChange={setTab}
              options={[
                { value: 'basic', label: messages.users.tabs.basic },
                { value: 'assets', label: messages.users.tabs.assets },
                { value: 'security', label: messages.users.tabs.security },
              ]}
            />

            <ScrollView contentContainerClassName="gap-3 pb-8">
              {tab === 'basic' ? <UserBasicTab user={user} /> : null}
              {tab === 'assets' ? <UserAssetsTab uid={uid} /> : null}
              {tab === 'security' ? <UserSecurityTab uid={uid} /> : null}
            </ScrollView>
          </View>
        ) : null}
      </StateView>
    </Screen>
  )
}
