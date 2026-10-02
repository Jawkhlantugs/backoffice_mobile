import { View } from 'react-native'

import { cn } from '@/lib/cn'

import { AmountText } from './amount-text'
import { AppText } from './app-text'
import type { TableCell, TableColumn } from './record-table'
import { StatusPill } from './status-pill'

const EMPTY = '—'

/** Хүснэгтийн нэг нүд — текст, дүн (tabular) эсвэл статус pill. */
export function DataTableCell({
  cell,
  column,
}: {
  cell: TableCell | undefined
  column: Pick<TableColumn, 'width' | 'align'>
}) {
  return (
    <View
      style={{ width: column.width }}
      className={cn(
        'justify-center px-3',
        column.align === 'right' && 'items-end',
      )}
    >
      <CellContent cell={cell} />
    </View>
  )
}

function CellContent({ cell }: { cell: TableCell | undefined }) {
  if (!cell) {
    return <AppText variant="caption">{EMPTY}</AppText>
  }
  switch (cell.kind) {
    case 'status':
      return <StatusPill label={cell.label} tone={cell.tone} />
    case 'amount':
      return (
        <AmountText
          amount={cell.amount}
          variant="caption"
          numberOfLines={1}
          className="text-foreground"
        />
      )
    case 'text':
      return (
        <AppText
          variant="caption"
          numberOfLines={1}
          className="text-foreground"
        >
          {cell.text}
        </AppText>
      )
  }
}
