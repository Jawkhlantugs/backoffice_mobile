import { useMemo, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { AppIcon } from './app-icon'
import { AppText } from './app-text'
import { BottomSheet } from './bottom-sheet'
import { SearchInput } from './search-input'
import { StateView } from './state-view'

export type SelectOption<V extends string = string> = {
  value: V
  label: string
  description?: string
}

/** Хайлтын талбар гарах доод хэмжээ — цөөн сонголтод зөвхөн саад болно. */
const SEARCH_THRESHOLD = 8

/**
 * Жагсаалтаас нэгийг сонгох хавтан — вэбийн Select/Command-ийн оронд.
 * Сонголт олон бол хайлт автоматаар гарна.
 */
export function SelectSheet<V extends string = string>({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  loading = false,
  error,
  onRetry,
  emptyLabel = messages.common.empty,
}: {
  visible: boolean
  title: string
  options: SelectOption<V>[]
  value?: V
  onSelect: (value: V) => void
  onClose: () => void
  loading?: boolean
  error?: unknown
  onRetry?: () => void
  emptyLabel?: string
}) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) ||
        option.description?.toLowerCase().includes(needle),
    )
  }, [options, search])

  function close() {
    setSearch('')
    onClose()
  }

  return (
    <BottomSheet visible={visible} title={title} onClose={close}>
      {options.length > SEARCH_THRESHOLD ? (
        <SearchInput value={search} onChangeText={setSearch} />
      ) : null}

      <StateView
        loading={loading}
        error={error}
        isEmpty={filtered.length === 0}
        emptyLabel={emptyLabel}
        onRetry={onRetry}
      >
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const selected = item.value === value
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  onSelect(item.value)
                  close()
                }}
                className={cn(
                  'min-h-11 flex-row items-center gap-3 rounded-lg px-3 py-2.5',
                  selected && 'bg-accent',
                )}
              >
                <View className="flex-1 gap-0.5">
                  <AppText
                    variant="body"
                    className={cn(selected && 'font-semibold')}
                  >
                    {item.label}
                  </AppText>
                  {item.description ? (
                    <AppText variant="caption" numberOfLines={2}>
                      {item.description}
                    </AppText>
                  ) : null}
                </View>
                {selected ? <AppIcon name="check" size={iconSize.sm} /> : null}
              </Pressable>
            )
          }}
        />
      </StateView>
    </BottomSheet>
  )
}
