import { Animated, Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { AppIcon, type AppIconName } from './app-icon'
import { AppText } from './app-text'
import { DataTableStickyCell } from './data-table-sticky-cell'
import type { TableColumn, TableSort } from './record-table'

/** `h-10` — `stickyHeaderIndices`-д өндөр нь тогтмол байх ёстой. */
export const TABLE_HEADER_HEIGHT = 40

function sortIcon(column: TableColumn, sort: TableSort | null): AppIconName {
  if (sort?.key !== column.key) return 'sort'
  return sort.direction === 'asc' ? 'sortAsc' : 'sortDesc'
}

/** Баганын толгой — дарахад эрэмбэ солигдоно, идэвхтэй нь тод. */
export function DataTableHeader({
  columns,
  width,
  sort,
  onSort,
  offset,
}: {
  columns: readonly TableColumn[]
  width: number
  sort: TableSort | null
  onSort: (key: string) => void
  offset: Animated.AnimatedInterpolation<number>
}) {
  const sticky = columns.find((column) => column.sticky)
  const scrolling = columns.filter((column) => !column.sticky)

  return (
    <View
      style={{ width, height: TABLE_HEADER_HEIGHT }}
      className="flex-row border-b border-border bg-muted"
    >
      {sticky ? <View style={{ width: sticky.width }} /> : null}
      {scrolling.map((column) => (
        <HeaderCell
          key={column.key}
          column={column}
          sort={sort}
          onSort={onSort}
          style={{ width: column.width }}
        />
      ))}
      {sticky ? (
        <DataTableStickyCell
          offset={offset}
          width={sticky.width}
          className="bg-muted px-0"
        >
          <HeaderCell
            column={sticky}
            sort={sort}
            onSort={onSort}
            style={{ flex: 1 }}
          />
        </DataTableStickyCell>
      ) : null}
    </View>
  )
}

function HeaderCell({
  column,
  sort,
  onSort,
  style,
}: {
  column: TableColumn
  sort: TableSort | null
  onSort: (key: string) => void
  style: { width: number } | { flex: number }
}) {
  const active = sort?.key === column.key

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${messages.table.sortBy}: ${column.label}`}
      accessibilityState={{ selected: active }}
      onPress={() => onSort(column.key)}
      style={style}
      className={cn(
        'h-full flex-row items-center gap-1 px-3 active:opacity-60',
        column.align === 'right' && 'justify-end',
      )}
    >
      <AppText
        variant="tiny"
        numberOfLines={1}
        className={cn(
          'shrink uppercase tracking-wide',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {column.label}
      </AppText>
      <AppIcon
        name={sortIcon(column, sort)}
        size={iconSize.xs}
        tone={active ? 'default' : 'muted'}
      />
    </Pressable>
  )
}
