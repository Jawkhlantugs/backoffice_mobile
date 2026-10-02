import { ScrollView, View } from 'react-native'

import { useListViewStore } from '@/core/ui/list-view-store'
import { messages } from '@/lib/messages'

import { AppSwitch } from './app-switch'
import { AppText } from './app-text'
import { BottomSheet } from './bottom-sheet'
import type { TableColumn } from './record-table'
import { TextButton } from './text-button'

const NO_HIDDEN: readonly string[] = []

/** Хүснэгтийн баганыг нуух/харуулах — вэбийн "View options"-ийн хувилбар. */
export function ColumnPickerSheet({
  visible,
  onClose,
  tableId,
  columns,
}: {
  visible: boolean
  onClose: () => void
  tableId: string
  columns: readonly TableColumn[]
}) {
  const hidden = useListViewStore((state) => state.hidden[tableId]) ?? NO_HIDDEN
  const toggleColumn = useListViewStore((state) => state.toggleColumn)
  const showAllColumns = useListViewStore((state) => state.showAllColumns)

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={messages.table.columns}
    >
      <AppText variant="caption">{messages.table.columnsHint}</AppText>
      <ScrollView className="shrink">
        {columns
          .filter((column) => !column.sticky)
          .map((column) => (
            <View
              key={column.key}
              className="min-h-12 flex-row items-center gap-3 border-b border-border"
            >
              <AppText variant="body" numberOfLines={1} className="flex-1">
                {column.label}
              </AppText>
              <AppSwitch
                value={!hidden.includes(column.key)}
                onChange={() => toggleColumn(tableId, column.key)}
                label={column.label}
              />
            </View>
          ))}
      </ScrollView>
      {hidden.length > 0 ? (
        <TextButton
          label={messages.table.showAll}
          onPress={() => showAllColumns(tableId)}
          className="self-start"
        />
      ) : null}
    </BottomSheet>
  )
}
