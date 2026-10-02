import { useState } from 'react'
import { View } from 'react-native'

import { useListViewStore, type ListViewMode } from '@/core/ui/list-view-store'
import { messages } from '@/lib/messages'

import { ColumnPickerSheet } from './column-picker-sheet'
import { IconButton } from './icon-button'
import type { TableColumn } from './record-table'
import { SegmentedControl, type SegmentedOption } from './segmented-control'

const modeOptions = (): SegmentedOption<ListViewMode>[] => [
  { value: 'cards', label: messages.table.cards, icon: 'cards' },
  { value: 'table', label: messages.table.table, icon: 'table' },
]

/**
 * Жагсаалтын дээрх мөр: карт ⇄ хүснэгт сонголт (бүх жагсаалтад нэг) ба
 * хүснэгтийн горимд баганы сонголт.
 */
export function ListViewToolbar({
  tableId,
  columns,
}: {
  tableId: string
  /** Хүснэгтийн горимд л — картад багана сонгох утгагүй. */
  columns?: readonly TableColumn[]
}) {
  const mode = useListViewStore((state) => state.mode)
  const setMode = useListViewStore((state) => state.setMode)
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <View className="flex-row items-center gap-2">
      <SegmentedControl
        options={modeOptions()}
        value={mode}
        onChange={(next) => void setMode(next)}
        className="w-56"
      />
      <View className="flex-1" />
      {columns ? (
        <>
          <IconButton
            icon="columns"
            label={messages.table.columns}
            size="sm"
            onPress={() => setPickerOpen(true)}
          />
          <ColumnPickerSheet
            visible={pickerOpen}
            onClose={() => setPickerOpen(false)}
            tableId={tableId}
            columns={columns}
          />
        </>
      ) : null}
    </View>
  )
}
