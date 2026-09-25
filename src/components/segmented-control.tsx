import { Pressable } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon, type AppIconName } from './app-icon'
import { AppText } from './app-text'
import { GlassSurface } from './glass-surface'

export type SegmentedOption<T extends string> = {
  value: T
  label: string
  icon?: AppIconName
  /** Тоо байвал шошгоны ард гарна — "Батлах 3". */
  count?: number
}

/**
 * Хоёроос дөрвөн сонголттой шүүлтүүр — glass зам дээр сонгогдсон нь `bg-accent`.
 * Олон сонголттой бол чип мөр ашиглана, segment давчуу болно.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <GlassSurface
      fallbackClassName="border border-border bg-card"
      className={cn('flex-row rounded-full p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={cn(
              'h-9 flex-1 flex-row items-center justify-center gap-1.5 rounded-full',
              selected && 'bg-accent',
            )}
          >
            {option.icon ? (
              <AppIcon
                name={option.icon}
                size={iconSize.sm}
                tone={selected ? 'default' : 'muted'}
              />
            ) : null}
            <AppText
              variant="body"
              className={cn(
                'font-medium',
                selected ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {option.count === undefined
                ? option.label
                : `${option.label} ${option.count}`}
            </AppText>
          </Pressable>
        )
      })}
    </GlassSurface>
  )
}
