import { View, type ListRenderItemInfo } from 'react-native'
import { useRouter } from 'expo-router'

import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import type { PagedList } from '@/hooks/use-paged-list'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { AppLoader } from './app-loader'
import type { HeaderAction } from './app-header'
import type { AppIconName } from './app-icon'
import type { FilterChip } from './filter-chips'
import { RecordListScreen } from './record-list-screen'

/**
 * Хуудасласан жагсаалтын бүтэн дэлгэц — drawer/буцах, шинэчлэх, хайлт,
 * статус чип, доош гүйлгэхэд дараагийн хуудас бүгд дотроо. Дэлгэц нь зөвхөн
 * гарчиг, hook, картаа өгнө.
 */
export function PagedListScreen<T, S extends string = string>({
  title,
  subtitle,
  list,
  keyExtractor,
  renderItem,
  emptyIcon,
  emptyLabel = messages.common.empty,
  search,
  statusChips,
  headerActions = [],
  filters,
}: {
  title: string
  subtitle?: string
  list: PagedList<T>
  keyExtractor: (item: T) => string
  renderItem: (info: ListRenderItemInfo<T>) => React.ReactElement
  emptyIcon: AppIconName
  emptyLabel?: string
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  statusChips?: {
    chips: FilterChip<S>[]
    value: S
    onChange: (value: S) => void
  }
  headerActions?: HeaderAction[]
  /** Хайлтын доор харагдах нэмэлт шүүлтүүр (segment, сонголт). */
  filters?: React.ReactNode
}) {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const refresh = usePullRefresh(() => list.refetch())

  const count =
    list.total !== undefined
      ? `${list.total} ${messages.common.records}`
      : undefined

  return (
    <RecordListScreen
      title={title}
      subtitle={[subtitle, count].filter(Boolean).join(' · ') || undefined}
      leading={
        openDrawer
          ? { icon: 'menu', label: messages.nav.openMenu, onPress: openDrawer }
          : {
              icon: 'back',
              label: messages.nav.back,
              onPress: () => router.back(),
            }
      }
      headerActions={[
        ...headerActions,
        {
          icon: 'refresh',
          label: messages.common.refresh,
          onPress: () => list.refetch(),
        },
      ]}
      search={search}
      statusChips={statusChips}
      filters={filters}
      items={list.items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      loading={list.isPending}
      error={list.error}
      onRetry={() => list.refetch()}
      refreshing={refresh.refreshing}
      onRefresh={refresh.onRefresh}
      emptyIcon={emptyIcon}
      emptyLabel={emptyLabel}
      onEndReached={list.loadMore}
      footer={
        list.loadingMore ? (
          <View className="py-4">
            <AppLoader />
          </View>
        ) : undefined
      }
    />
  )
}
