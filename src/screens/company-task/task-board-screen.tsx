import { useMemo, useState } from 'react'
import { FlatList, View } from 'react-native'
import { useRouter } from 'expo-router'

import {
  AppHeader,
  FilterChips,
  Screen,
  SearchInput,
  SegmentedControl,
  SelectSheet,
  StateView,
} from '@/components'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { isOfficePrivileged } from '@/core/session/privileges'
import { useSessionStore } from '@/core/session/session-store'
import {
  countByStatus,
  TASK_STATUSES,
  type CompanyTask,
  type TaskScope,
  type TaskStatus,
} from '@/data/company-task/company-task-model'
import { useCompanyTasks, useMoveTask } from '@/hooks/use-company-tasks'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { TaskCard } from './task-card'

const text = messages.tasks
const ALL = 'all'
type StatusFilter = TaskStatus | typeof ALL

/** Самбарын баганын дараалал — жагсаалт ч энэ дарааллаар. */
const ORDER = Object.fromEntries(
  TASK_STATUSES.map((status, index) => [status, index]),
) as Record<TaskStatus, number>

/**
 * Вэбийн kanban-ы утасны хэлбэр: багана биш — статусын чипээр шүүсэн нэг
 * жагсаалт. Чирэхийн оронд картыг удаан дарж төлвийг солино.
 */
export function TaskBoardScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const privileged = isOfficePrivileged(useSessionStore((store) => store.user))

  const [scope, setScope] = useState<TaskScope>('assigned_to_me')
  const [status, setStatus] = useState<StatusFilter>(ALL)
  const [search, setSearch] = useState('')
  const [moving, setMoving] = useState<CompanyTask | null>(null)

  const query = useCompanyTasks(scope, scope === 'all' ? search : '')
  const move = useMoveTask()
  const refresh = usePullRefresh(() => query.refetch())

  const tasks = useMemo(() => query.data ?? [], [query.data])
  const counts = useMemo(() => countByStatus(tasks), [tasks])
  const visible = useMemo(
    () =>
      tasks
        .filter((task) => status === ALL || task.status === status)
        .sort(
          (a, b) =>
            ORDER[a.status] - ORDER[b.status] || a.position - b.position,
        ),
    [tasks, status],
  )

  const scopes: TaskScope[] = privileged
    ? ['assigned_to_me', 'created_by_me', 'all']
    : ['assigned_to_me', 'created_by_me']

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={text.title}
        subtitle={text.subtitle}
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
            icon: 'archive',
            label: text.archiveTitle,
            onPress: () => router.push('/office/tasks/archive'),
          },
          {
            icon: 'add',
            label: text.new,
            onPress: () => router.push('/office/tasks/new'),
          },
        ]}
      />

      <View className="gap-3 pb-3">
        <SegmentedControl
          options={scopes.map((value) => ({
            value,
            label: text.scopes[value],
          }))}
          value={scope}
          onChange={(next) => {
            setScope(next)
            setSearch('')
          }}
        />
        {scope === 'all' ? (
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder={text.searchPlaceholder}
          />
        ) : null}
        <FilterChips
          chips={[
            { value: ALL, label: `${messages.common.all} ${tasks.length}` },
            ...TASK_STATUSES.map((value) => ({
              value,
              label: `${text.statuses[value]} ${counts[value]}`,
            })),
          ]}
          value={status}
          onChange={setStatus}
        />
      </View>

      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={visible.length === 0}
        emptyIcon="checklist"
        emptyLabel={text.empty}
        emptyHint={text.emptyHint}
        onRetry={() => query.refetch()}
      >
        <FlatList
          data={visible}
          keyExtractor={(task) => task.id}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
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
              onLongPress={() => setMoving(item)}
            />
          )}
        />
      </StateView>

      <SelectSheet
        visible={moving !== null}
        title={moving ? `${text.moveTo} · ${moving.title}` : text.moveTo}
        options={TASK_STATUSES.map((value) => ({
          value,
          label: text.statuses[value],
        }))}
        value={moving?.status}
        onClose={() => setMoving(null)}
        onSelect={(next) => {
          if (moving && next !== moving.status) {
            move.mutate({ task: moving, status: next, position: 0 })
          }
        }}
      />
    </Screen>
  )
}
