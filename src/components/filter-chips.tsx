import { Pressable, ScrollView } from 'react-native'

import { cn } from '@/lib/cn'
import { useAppColors } from '@/theme/use-theme'

import { AppText } from './app-text'
import { GlassSurface } from './glass-surface'

export type FilterChip<T extends string> = { value: T; label: string }

/**
 * Хэвтээ гүйдэг статусын шүүлтүүр. Чип бүр glass; сонгогдсон нь primary-оор
 * будагдана — жагсаалт бүр ижил харагдана.
 */
export function FilterChips<T extends string>({
  chips,
  value,
  onChange,
  className,
}: {
  chips: FilterChip<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  const { colors } = useAppColors()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 pr-4"
      className={cn('flex-grow-0', className)}
    >
      {chips.map((chip) => {
        const selected = chip.value === value
        return (
          <Pressable
            key={chip.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(chip.value)}
          >
            <GlassSurface
              interactive
              tintColor={selected ? colors.primary : undefined}
              fallbackClassName={cn(
                'border',
                selected
                  ? 'border-primary bg-primary'
                  : 'border-border bg-card',
              )}
              className="h-8 justify-center rounded-full px-3"
            >
              <AppText
                variant="caption"
                className={cn(
                  'font-medium',
                  selected
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {chip.label}
              </AppText>
            </GlassSurface>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
