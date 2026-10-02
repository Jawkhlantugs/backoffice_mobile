import { FlatList, View } from 'react-native'

import { useListViewStore } from '@/core/ui/list-view-store'
import { messages } from '@/lib/messages'

import { AppHeader, type HeaderAction } from './app-header'
import type { AppIconName } from './app-icon'
import { DataTable } from './data-table'
import { FilterChips, type FilterChip } from './filter-chips'
import { ListViewToolbar } from './list-view-toolbar'
import { RecordCard } from './record-card'
import { buildRecordTable } from './record-table'
import type { RecordView } from './record-view'
import { Screen } from './screen'
import { SearchInput } from './search-input'
import { StateView } from './state-view'

/**
 * Бүх жагсаалтын нийтлэг бүрхүүл. Дэлгэц зөвхөн `item → RecordView`
 * (`record`) өгнө; түүнээс карт эсвэл хүснэгт (сонголтоор) зурагдана.
 * Домэйн бүр endpoint, model өөр тул UI-г л нийтэлсэн.
 */
export function RecordListScreen<T, S extends string = string>({
  title,
  subtitle,
  leading,
  headerActions,
  search,
  statusChips,
  items,
  keyExtractor,
  record,
  tableLabels,
  loading,
  error,
  onRetry,
  refreshing,
  onRefresh,
  emptyIcon,
  emptyLabel,
  footer,
  onEndReached,
  bottomInset,
  filters,
}: {
  title: string
  subtitle?: string
  leading: HeaderAction
  headerActions?: HeaderAction[]
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
  items: T[]
  keyExtractor: (item: T) => string
  record: (item: T) => RecordView
  /** Хүснэгтийн гарчиг, дүнгийн баганы нэр — анхдагч нь "Бичлэг", "Дүн". */
  tableLabels?: { title?: string; amount?: string }
  loading: boolean
  error?: unknown
  onRetry: () => void
  refreshing: boolean
  onRefresh: () => void
  emptyIcon: AppIconName
  emptyLabel: string
  /** Жагсаалтын төгсгөлд — дараагийн хуудас ачаалж буй loader гэх мэт. */
  footer?: React.ReactNode
  /** Доош гүйлгэж дуусахад дараагийн хуудас. */
  onEndReached?: () => void
  /** Scroll-ын доод зай (хөвөгч товч, таб bar). */
  bottomInset?: number
  filters?: React.ReactNode
}) {
  const mode = useListViewStore((state) => state.mode)
  const table =
    mode === 'table'
      ? buildRecordTable(
          items.map((item) => ({
            key: keyExtractor(item),
            view: record(item),
          })),
          {
            title: tableLabels?.title ?? messages.table.record,
            status: messages.table.status,
            amount: tableLabels?.amount ?? messages.table.amount,
          },
        )
      : null

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        actions={headerActions}
      />

      <View className="gap-3 pb-3">
        {search ? (
          <SearchInput
            value={search.value}
            onChangeText={search.onChange}
            placeholder={search.placeholder}
          />
        ) : null}
        {statusChips ? (
          <FilterChips
            chips={statusChips.chips}
            value={statusChips.value}
            onChange={statusChips.onChange}
          />
        ) : null}
        {filters}
        <ListViewToolbar tableId={title} columns={table?.columns} />
      </View>

      <StateView
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyIcon={emptyIcon}
        emptyLabel={emptyLabel}
        onRetry={onRetry}
      >
        {table ? (
          <DataTable
            tableId={title}
            columns={table.columns}
            rows={table.rows}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            footer={footer}
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={keyExtractor}
            contentContainerClassName="gap-3 pb-8"
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => <RecordCard {...record(item)} />}
            ListFooterComponent={footer ? <>{footer}</> : undefined}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            contentContainerStyle={
              bottomInset ? { paddingBottom: bottomInset } : undefined
            }
          />
        )}
      </StateView>
    </Screen>
  )
}
