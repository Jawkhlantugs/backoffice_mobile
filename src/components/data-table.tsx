import { useState } from 'react'
import { Animated, FlatList, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useListViewStore } from '@/core/ui/list-view-store'

import { DataTableHeader, TABLE_HEADER_HEIGHT } from './data-table-header'
import { DataTableRow, TABLE_ROW_HEIGHT } from './data-table-row'
import { RecordDetailSheet } from './record-detail-sheet'
import {
  fitColumns,
  nextSort,
  sortTableRows,
  type TableColumn,
  type TableRow,
  type TableSort,
} from './record-table'

const NO_HIDDEN: readonly string[] = []
/** Гадна хүрээний зүүн, баруун 1px — багтах өргөнөөс хасна. */
const FRAME_BORDER = 2

/**
 * Бүх жагсаалтын хүснэгтэн харагдац. Толгой дээшээ, гарчгийн багана зүүн
 * тийш наалдана; бусад нь хамт хэвтээ гүйнэ. Багана дээр дарж эрэмбэлж,
 * мөр дээр дарж картынхтай ижил дэлгэрэнгүй хавтан (үйлдэлтэй) нээнэ.
 * Багана/мөрийг `buildRecordTable` нь `RecordView`-ээс гаргана.
 */
export function DataTable({
  tableId,
  columns,
  rows,
  refreshing,
  onRefresh,
  onEndReached,
  footer,
}: {
  /** Нуусан баганыг энэ түлхүүрээр санана. */
  tableId: string
  columns: readonly TableColumn[]
  rows: readonly TableRow[]
  refreshing: boolean
  onRefresh: () => void
  onEndReached?: () => void
  footer?: React.ReactNode
}) {
  const insets = useSafeAreaInsets()
  const hidden = useListViewStore((state) => state.hidden[tableId]) ?? NO_HIDDEN
  const [scrollX] = useState(() => new Animated.Value(0))
  const [offset] = useState(() =>
    scrollX.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    }),
  )
  const [onScroll] = useState(() =>
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
      useNativeDriver: true,
    }),
  )
  const [available, setAvailable] = useState(0)
  const [sort, setSort] = useState<TableSort | null>(null)
  // Түлхүүрээр санана — үйлдлийн дараа жагсаалт шинэчлэгдэхэд хавтан
  // шинэ өгөгдлийг харуулна (картынх шиг).
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const selected = rows.find((row) => row.key === selectedKey)?.view ?? null

  const visible = fitColumns(
    columns.filter((column) => column.sticky || !hidden.includes(column.key)),
    available,
  )
  const width = visible.reduce((sum, column) => sum + column.width, 0)
  const activeSort =
    sort && visible.some((column) => column.key === sort.key) ? sort : null
  const sorted = sortTableRows(rows, activeSort)

  const openRow = (row: TableRow) => {
    if (row.view.onPress) row.view.onPress()
    else setSelectedKey(row.key)
  }

  return (
    <View
      className="flex-1 overflow-hidden rounded-xl border border-border bg-card"
      style={{ marginBottom: insets.bottom }}
      onLayout={(event) =>
        setAvailable(event.nativeEvent.layout.width - FRAME_BORDER)
      }
    >
      <Animated.ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        <FlatList
          style={{ width }}
          data={sorted}
          extraData={visible}
          keyExtractor={(row) => row.key}
          renderItem={({ item }) => (
            <DataTableRow
              row={item}
              columns={visible}
              width={width}
              offset={offset}
              onPress={openRow}
            />
          )}
          getItemLayout={(_, index) => ({
            length: TABLE_ROW_HEIGHT,
            offset: TABLE_HEADER_HEIGHT + TABLE_ROW_HEIGHT * index,
            index,
          })}
          ListHeaderComponent={
            <DataTableHeader
              columns={visible}
              width={width}
              sort={activeSort}
              onSort={(key) => setSort((current) => nextSort(current, key))}
              offset={offset}
            />
          }
          stickyHeaderIndices={[0]}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={footer ? <>{footer}</> : undefined}
          showsVerticalScrollIndicator={false}
        />
      </Animated.ScrollView>

      <RecordDetailSheet
        visible={selected !== null}
        onClose={() => setSelectedKey(null)}
        title={selected?.title ?? ''}
        status={selected?.status}
        amount={selected?.amount}
        fields={[...(selected?.fields ?? []), ...(selected?.details ?? [])]}
        actions={selected?.actions}
      />
    </View>
  )
}
