import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon } from './app-icon'
import { AppText } from './app-text'
import { SelectSheet, type SelectOption } from './select-sheet'

/**
 * Формын dropdown — `AppInput`-тэй ижил хэлбэртэй, дарахад SelectSheet
 * нээгдэнэ. Сонголтууд ачаалж байх үед ч нээж болно (sheet дотор loader).
 */
export function SelectField<V extends string = string>({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  disabled = false,
  loading,
  loadError,
  onRetry,
}: {
  label: string
  placeholder: string
  options: SelectOption<V>[]
  value?: V
  onChange: (value: V) => void
  /** Талбарын доор гарах validation алдаа. */
  error?: string
  disabled?: boolean
  loading?: boolean
  loadError?: unknown
  onRetry?: () => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <View className="gap-1.5">
      <AppText variant="label">{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={cn(
          'h-11 flex-row items-center gap-2 rounded-lg border bg-card px-3',
          error ? 'border-destructive' : 'border-input',
          disabled && 'opacity-50',
        )}
      >
        <AppText
          variant="body"
          numberOfLines={1}
          className={cn('flex-1', !selected && 'text-muted-foreground')}
        >
          {selected?.label ?? placeholder}
        </AppText>
        <AppIcon name="expand" size={iconSize.sm} tone="muted" />
      </Pressable>
      {error ? (
        <AppText variant="caption" className="text-destructive">
          {error}
        </AppText>
      ) : null}

      <SelectSheet
        visible={open}
        title={label}
        options={options}
        value={value}
        onSelect={onChange}
        onClose={() => setOpen(false)}
        loading={loading}
        error={loadError}
        onRetry={onRetry}
      />
    </View>
  )
}
