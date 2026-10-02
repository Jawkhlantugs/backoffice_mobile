import { useState } from 'react'

import { useScreenLeading } from '@/core/navigation/use-screen-leading'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import type { HeaderAction } from './app-header'
import type { AppIconName } from './app-icon'
import type { FilterChip } from './filter-chips'
import { RecordListScreen } from './record-list-screen'
import type { RecordView } from './record-view'

/**
 * Хуудасгүй жагсаалт (тохиргоо, ангилал, эрх) — endpoint бүгдийг нэг
 * дор буцаадаг. Хайлт нь ачаалсан мөрөн дотор (`searchText`), карт ⇄
 * хүснэгт `PagedListScreen`-тэй ижил.
 */
export function QueryListScreen<T, S extends string = string>({
  title,
  subtitle,
  query,
  keyExtractor,
  record,
  searchText,
  searchPlaceholder,
  tableLabels,
  emptyIcon,
  emptyLabel = messages.common.empty,
  statusChips,
  headerActions = [],
  filters,
}: {
  title: string
  subtitle?: string
  query: {
    data: T[] | undefined
    isPending: boolean
    error: unknown
    refetch: () => Promise<unknown>
  }
  keyExtractor: (item: T) => string
  record: (item: T) => RecordView
  /** Өгвөл хайлтын талбар гарч, энэ текстээр шүүнэ. */
  searchText?: (item: T) => string
  searchPlaceholder?: string
  tableLabels?: { title?: string; amount?: string }
  emptyIcon: AppIconName
  emptyLabel?: string
  statusChips?: {
    chips: FilterChip<S>[]
    value: S
    onChange: (value: S) => void
  }
  headerActions?: HeaderAction[]
  filters?: React.ReactNode
}) {
  const leading = useScreenLeading()
  const refresh = usePullRefresh(() => query.refetch())
  const [search, setSearch] = useState('')

  const needle = search.trim().toLowerCase()
  const all = query.data ?? []
  const items =
    searchText && needle
      ? all.filter((item) => searchText(item).toLowerCase().includes(needle))
      : all

  return (
    <RecordListScreen
      title={title}
      subtitle={[subtitle, `${items.length} ${messages.common.records}`]
        .filter(Boolean)
        .join(' · ')}
      leading={leading}
      headerActions={[
        ...headerActions,
        {
          icon: 'refresh',
          label: messages.common.refresh,
          onPress: () => void query.refetch(),
        },
      ]}
      search={
        searchText
          ? {
              value: search,
              onChange: setSearch,
              placeholder: searchPlaceholder,
            }
          : undefined
      }
      statusChips={statusChips}
      filters={filters}
      items={items}
      keyExtractor={keyExtractor}
      record={record}
      tableLabels={tableLabels}
      loading={query.isPending}
      error={query.error}
      onRetry={() => void query.refetch()}
      refreshing={refresh.refreshing}
      onRefresh={refresh.onRefresh}
      emptyIcon={emptyIcon}
      emptyLabel={emptyLabel}
    />
  )
}
