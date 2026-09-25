import { useState } from 'react'
import { FlatList, View } from 'react-native'
import { useRouter } from 'expo-router'

import {
  AppHeader,
  Screen,
  SearchInput,
  SegmentedControl,
  StateView,
} from '@/components'
import { isOfficePrivileged } from '@/core/session/privileges'
import { useSessionStore } from '@/core/session/session-store'
import type { TaskScope } from '@/data/company-task/company-task-model'
import { useCompanyTasks } from '@/hooks/use-company-tasks'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { TaskCard } from './task-card'

const text = messages.tasks

/** Архивласан (дууссан/буцаасан) ажлууд — дарж ороод архиваас гаргана. */
export function TaskArchiveScreen() {
  const router = useRouter()
  const privileged = isOfficePrivileged(useSessionStore((store) => store.user))
  const [scope, setScope] = useState<TaskScope>('assigned_to_me')
  const [search, setSearch] = useState('')

  const query = useCompanyTasks(scope, scope === 'all' ? search : '', true)
  const refresh = usePullRefresh(() => query.refetch())
  const tasks = query.data ?? []
  const scopes: TaskScope[] = privileged
    ? ['assigned_to_me', 'created_by_me', 'all']
    : ['assigned_to_me', 'created_by_me']

  return (
    <Screen>
      <AppHeader
        title={text.archiveTitle}
        subtitle={text.title}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
      />
      <View className="gap-3 pb-3">
        <SegmentedControl
          options={scopes.map((value) => ({
            value,
            label: text.scopes[value],
          }))}
          value={scope}
          onChange={setScope}
        />
        {scope === 'all' ? (
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder={text.searchPlaceholder}
          />
        ) : null}
      </View>
      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={tasks.length === 0}
        emptyIcon="archive"
        emptyLabel={text.empty}
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={tasks}
          keyExtractor={(task) => task.id}
          contentContainerClassName="gap-3 pb-8"
          refreshing={refresh.refreshing}
          onRefresh={refresh.onRefresh}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() =>
                router.push({
                  pathname: '/office/tasks/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
        />
      </StateView>
    </Screen>
  )
}
