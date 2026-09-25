import { useMemo, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { AppButton } from './app-button'
import { AppIcon } from './app-icon'
import { AppText } from './app-text'
import { BottomSheet } from './bottom-sheet'
import { SearchInput } from './search-input'
import type { SelectOption } from './select-sheet'
import { StateView } from './state-view'

/**
 * Олноор сонгох талбар (хариуцагчид). Сонгосон нь чип болж харагдана, чип
 * дээр дарж шууд хасна. Хавтанд хайлт + тэмдэглэгээ.
 */
export function MultiSelectField({
  label,
  placeholder,
  options,
  values,
  onChange,
  loading,
  error,
  onRetry,
}: {
  label: string
  placeholder: string
  options: SelectOption[]
  values: string[]
  onChange: (values: string[]) => void
  loading?: boolean
  error?: unknown
  onRetry?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = options.filter((option) => values.includes(option.value))
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return options
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) ||
        option.description?.toLowerCase().includes(needle),
    )
  }, [options, search])

  const toggle = (value: string) =>
    onChange(
      values.includes(value)
        ? values.filter((each) => each !== value)
        : [...values, value],
    )

  return (
    <View className="gap-1.5">
      <AppText variant="label">{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        className="min-h-11 flex-row flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-2"
      >
        {selected.length === 0 ? (
          <AppText variant="body" className="flex-1 text-muted-foreground">
            {placeholder}
          </AppText>
        ) : (
          selected.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={`${option.label} ${messages.form.remove}`}
              onPress={() => toggle(option.value)}
              className="flex-row items-center gap-1 rounded-full bg-muted px-2.5 py-1"
            >
              <AppText
                variant="caption"
                className="text-foreground"
                numberOfLines={1}
              >
                {option.label}
              </AppText>
              <AppIcon name="close" size={iconSize.xs} tone="muted" />
            </Pressable>
          ))
        )}
        <View className="ml-auto">
          <AppIcon name="add" size={iconSize.sm} tone="muted" />
        </View>
      </Pressable>

      <BottomSheet visible={open} title={label} onClose={() => setOpen(false)}>
        <SearchInput value={search} onChangeText={setSearch} />
        <StateView
          loading={loading}
          error={error}
          onRetry={onRetry}
          isEmpty={filtered.length === 0}
        >
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const checked = values.includes(item.value)
              return (
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  onPress={() => toggle(item.value)}
                  className={cn(
                    'min-h-11 flex-row items-center gap-3 rounded-lg px-3 py-2.5',
                    checked && 'bg-accent',
                  )}
                >
                  <View className="flex-1 gap-0.5">
                    <AppText variant="body">{item.label}</AppText>
                    {item.description ? (
                      <AppText variant="caption">{item.description}</AppText>
                    ) : null}
                  </View>
                  {checked ? <AppIcon name="check" size={iconSize.sm} /> : null}
                </Pressable>
              )
            }}
          />
        </StateView>
        <AppButton
          label={`${messages.common.confirm} (${values.length})`}
          onPress={() => setOpen(false)}
        />
      </BottomSheet>
    </View>
  )
}
