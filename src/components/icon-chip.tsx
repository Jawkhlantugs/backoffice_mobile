import { View } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon, type AppIconName } from './app-icon'

type ChipSize = 'sm' | 'md' | 'lg'

const BOX: Record<ChipSize, string> = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-10 w-10 rounded-xl',
  lg: 'h-12 w-12 rounded-xl',
}

const GLYPH: Record<ChipSize, number> = {
  sm: iconSize.sm,
  md: iconSize.md,
  lg: iconSize.lg,
}

/**
 * Дэвсгэртэй дүрс (хоосон төлөв, түгжээ). Өнгөгүй — статусыг дүрсээр биш
 * гарчиг, pill-ээр илэрхийлнэ.
 */
export function IconChip({
  name,
  size = 'md',
  className,
}: {
  name: AppIconName
  size?: ChipSize
  className?: string
}) {
  return (
    <View
      className={cn(
        'items-center justify-center bg-muted',
        BOX[size],
        className,
      )}
    >
      <AppIcon name={name} size={GLYPH[size]} />
    </View>
  )
}
