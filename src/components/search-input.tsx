import { Pressable, TextInput } from 'react-native'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'
import { useAppColors } from '@/theme/use-theme'

import { AppIcon } from './app-icon'
import { GlassSurface } from './glass-surface'

/** Жагсаалт, цэс шүүх glass хайлтын талбар. Утга байвал арилгах товч гарна. */
export function SearchInput({
  value,
  onChangeText,
  placeholder = messages.common.search,
  className,
}: {
  value: string
  onChangeText: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const { colors } = useAppColors()

  return (
    <GlassSurface
      fallbackClassName="border border-border bg-card"
      className={cn(
        'h-11 flex-row items-center gap-2 rounded-full px-4',
        className,
      )}
    >
      <AppIcon name="search" size={iconSize.sm} tone="muted" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        className="flex-1 p-0 text-body text-foreground"
      />

      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={messages.common.cancel}
          onPress={() => onChangeText('')}
          hitSlop={8}
        >
          <AppIcon name="cancel" size={iconSize.sm} tone="muted" />
        </Pressable>
      ) : null}
    </GlassSurface>
  )
}
