import { useState } from 'react'
import { useRouter } from 'expo-router'
import { FlatList } from 'react-native'

import { AppHeader, Screen, SearchInput, StateView } from '@/components'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useExchangeUsers } from '@/hooks/use-exchange-users'
import { messages } from '@/lib/messages'

import { UserSearchCard } from './user-search-card'

export function UserSearchScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const [search, setSearch] = useState('')

  const query = useExchangeUsers(search)
  const items = query.data?.items ?? []

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.users.title}
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
      />

      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder={messages.users.searchPlaceholder}
        className="mb-3"
      />

      <StateView
        loading={query.isPending && search.trim().length > 0}
        error={query.error}
        isEmpty={search.trim().length === 0 || items.length === 0}
        emptyIcon="users"
        emptyLabel={
          search.trim().length === 0
            ? messages.users.searchHint
            : messages.users.empty
        }
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <UserSearchCard
              user={item}
              onPress={() => router.push(`/users/${item.id}`)}
            />
          )}
        />
      </StateView>
    </Screen>
  )
}
