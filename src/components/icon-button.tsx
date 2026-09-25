import { Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon, type AppIconName, type IconTone } from './app-icon'
import { GlassSurface } from './glass-surface'

type Size = 'sm' | 'md'

const BOX: Record<Size, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
}

const GLYPH: Record<Size, number> = {
  sm: iconSize.md,
  md: iconSize.lg,
}

/**
 * Зөвхөн дүрстэй дугуй товч — толгойн цэс/буцах, drawer хаах, macro гэх мэт.
 * `glass` бол iOS 26 навигацын товч шиг хөвөгч glass; үгүй бол тунгалаг.
 * Хүрэлтийн бай `sm` дээр ч 44pt (`hitSlop`).
 */
export function IconButton({
  icon,
  label,
  onPress,
  size = 'md',
  glass = true,
  tone = 'default',
  disabled = false,
  className,
}: {
  icon: AppIconName
  /** Screen reader-т — дүрс л харагддаг тул заавал. */
  label: string
  onPress: () => void
  size?: Size
  glass?: boolean
  tone?: IconTone
  disabled?: boolean
  className?: string
}) {
  const box = cn('items-center justify-center rounded-full', BOX[size])
  const glyph = <AppIcon name={icon} size={GLYPH[size]} tone={tone} />

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={size === 'sm' ? 4 : 0}
      className={cn(disabled && 'opacity-50', className)}
    >
      {glass ? (
        <GlassSurface
          interactive
          fallbackClassName="border border-border bg-card"
          className={box}
        >
          {glyph}
        </GlassSurface>
      ) : (
        <View className={box}>{glyph}</View>
      )}
    </Pressable>
  )
}
