import { memo } from 'react'
import { Animated, Pressable, View } from 'react-native'

import { AppText } from './app-text'
import { DataTableCell } from './data-table-cell'
import { DataTableStickyCell } from './data-table-sticky-cell'
import type { TableColumn, TableRow } from './record-table'

/** `getItemLayout`-д — мөрийн өндөр тогтмол (гарчиг + дэд мөр). */
export const TABLE_ROW_HEIGHT = 52

/**
 * Хүснэгтийн нэг мөр. Гарчгийн нүд (дэд мөртэй) зүүн талд наалдана,
 * бусад нь мөртэйгээ хамт гүйнэ. Дарахад дэлгэрэнгүй/засах руу.
 */
export const DataTableRow = memo(function DataTableRow({
  row,
  columns,
  width,
  offset,
  onPress,
}: {
  row: TableRow
  columns: readonly TableColumn[]
  width: number
  offset: Animated.AnimatedInterpolation<number>
  onPress: (row: TableRow) => void
}) {
  const sticky = columns.find((column) => column.sticky)
  const scrolling = columns.filter((column) => !column.sticky)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={row.view.title}
      onPress={() => onPress(row)}
      style={{ width, height: TABLE_ROW_HEIGHT }}
      className="flex-row border-b border-border bg-card active:bg-accent"
    >
      {sticky ? <View style={{ width: sticky.width }} /> : null}
      {scrolling.map((column) => (
        <DataTableCell
          key={column.key}
          cell={row.cells[column.key]}
          column={column}
        />
      ))}
      {sticky ? (
        <DataTableStickyCell
          offset={offset}
          width={sticky.width}
          className="bg-card"
        >
          <AppText
            variant="caption"
            numberOfLines={1}
            className="font-semibold text-foreground"
          >
            {row.view.title}
          </AppText>
          {row.view.subtitle ? (
            <AppText variant="tiny" numberOfLines={1}>
              {row.view.subtitle}
            </AppText>
          ) : null}
        </DataTableStickyCell>
      ) : null}
    </Pressable>
  )
})
