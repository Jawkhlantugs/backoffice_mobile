import { View, type ColorValue, type ViewProps } from 'react-native'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { cssInterop } from 'nativewind'

import { cn } from '@/lib/cn'
import { useAppColors } from '@/theme/use-theme'

// GlassView нь гадны native компонент — NativeWind-ийн className-ийг style
// болгож дамжуулахгүй бол rounded, padding зэрэг class үйлчлэхгүй.
cssInterop(GlassView, { className: 'style' })

/** Нэг л удаа шалгана — iOS 26+ дээр л `true`, бусад нь fallback. */
const LIQUID_GLASS = isLiquidGlassAvailable()

export type GlassSurfaceProps = ViewProps & {
  className?: string
  /** Glass байхгүй үед (Android, iOS < 26) хэрэглэх хатуу дэвсгэр. */
  fallbackClassName?: string
  /** Glass-ийг өнгөөр будах — primary/destructive товч гэх мэт. */
  tintColor?: ColorValue
  /** Дарахад glass хөдөлж хариу үзүүлнэ — товч, таб. */
  interactive?: boolean
  /** `clear` нь ард талын контентыг илүү тод харуулна. */
  variant?: 'regular' | 'clear'
}

/**
 * Liquid Glass-ийн ганц эх сурвалж. Бусад компонент `GlassView`-г шууд
 * импортлохгүй — fallback, theme, className бүгд энд нэг удаа шийдэгдэнэ.
 * Апп өөрийн theme сонголттой тул glass-ийн `colorScheme`-ийг түүнээс авна.
 */
export function GlassSurface({
  className,
  fallbackClassName = 'border border-border bg-elevated',
  tintColor,
  interactive = false,
  variant = 'regular',
  ...rest
}: GlassSurfaceProps) {
  const { scheme } = useAppColors()

  if (!LIQUID_GLASS) {
    return (
      <View
        className={cn('overflow-hidden', fallbackClassName, className)}
        {...rest}
      />
    )
  }

  return (
    <GlassView
      glassEffectStyle={variant}
      tintColor={tintColor}
      isInteractive={interactive}
      colorScheme={scheme}
      className={cn('overflow-hidden', className)}
      {...rest}
    />
  )
}

/** Glass идэвхтэй эсэх — дэвсгэрийн давхарга зэргийг нөхцөлөөр харуулахад. */
export const hasLiquidGlass = LIQUID_GLASS
