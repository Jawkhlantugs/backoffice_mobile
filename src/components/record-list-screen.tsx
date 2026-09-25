import { FlatList, View, type ListRenderItemInfo } from 'react-native'

import { AppHeader, type HeaderAction } from './app-header'
import type { AppIconName } from './app-icon'
import { FilterChips, type FilterChip } from './filter-chips'
import { Screen } from './screen'
import { SearchInput } from './search-input'
import { StateView } from './state-view'

/**
 * Finance домэйнуудын (order, convert, crypto, bank, buynow) жагсаалтын
 * нийтлэг бүрхүүл. Домэйн бүр endpoint, model өөр өөр тул зөвхөн UI-г
 * нийтэлж, дэлгэц бүрийг өөрийн repository/hook-той үлдээнэ (гурвын дүрэм —
 * 10+ дэлгэц ижил хэв маягтай тул shell-ийг component болгосон).
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
  renderItem,
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
  keyExtractor: (item: T, index: number) => string
  renderItem: (info: ListRenderItemInfo<T>) => React.ReactElement
  loading: boolean
  error?: unknown
  onRetry: () => void
  refreshing: boolean
  onRefresh: () => void
  emptyIcon: AppIconName
  emptyLabel: string
  /** Хуудаслалт — жагсаалтын төгсгөлд "Дараагийн хуудас" товч гэх мэт. */
  footer?: React.ReactNode
  /** Доош гүйлгэж дуусахад дараагийн хуудас. */
  onEndReached?: () => void
  /** Scroll-ын доод зай (хөвөгч товч, таб bar). */
  bottomInset?: number
  filters?: React.ReactNode
}) {
  return (
    <Screen edges={['top']}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        actions={headerActions}
      />

      {search || statusChips || filters ? (
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
        </View>
      ) : null}

      <StateView
        loading={loading}
        error={error}
        isEmpty={items.length === 0}
        emptyIcon={emptyIcon}
        emptyLabel={emptyLabel}
        onRetry={onRetry}
      >
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={renderItem}
          ListFooterComponent={footer ? <>{footer}</> : undefined}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={
            bottomInset ? { paddingBottom: bottomInset } : undefined
          }
        />
      </StateView>
    </Screen>
  )
}
