import { useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { logger } from '@/lib/logger'
import { iconSize, type AppColors } from '@/theme/tokens'
import { useAppColors } from '@/theme/use-theme'

import { AppIcon, type AppIconName, type IconTone } from './app-icon'
import { AppText } from './app-text'
import { GlassSurface } from './glass-surface'

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost'
type Size = 'md' | 'lg'

/** Glass байхгүй үеийн хатуу дэвсгэр — өмнөх харагдацтай ижил. */
const FALLBACK: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-card border border-border',
  destructive: 'bg-destructive',
  ghost: 'bg-transparent',
}

const LABEL: Record<Variant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-foreground',
  destructive: 'text-destructive-foreground',
  ghost: 'text-muted-foreground',
}

const ICON_TONE: Record<Variant, IconTone> = {
  primary: 'inverse',
  secondary: 'default',
  destructive: 'inverse',
  ghost: 'muted',
}

/** Glass-ийн будаг: primary/destructive нь өнгөтэй, secondary нь цэвэр glass. */
const TINT: Record<
  Exclude<Variant, 'ghost'>,
  (colors: AppColors) => string | undefined
> = {
  primary: (colors) => colors.primary,
  secondary: () => undefined,
  destructive: (colors) => colors.destructive,
}

const HEIGHT: Record<Size, string> = {
  md: 'h-11',
  lg: 'h-12',
}

export type AppButtonProps = {
  label: string
  onPress: () => void | Promise<void>
  variant?: Variant
  size?: Size
  icon?: AppIconName
  disabled?: boolean
  loading?: boolean
  className?: string
}

/**
 * Дарангуутаа өөрөө түгжигдэнэ (§1.5): `onPress` нь Promise буцаавал дуустал
 * дахин дарагдахгүй. Мөнгө хөдөлгөх товч дээр давхар илгээлт нь хоёр
 * гүйлгээ болдог тул энэ хамгаалалт компонент дотор байх ёстой — дуудагч
 * бүрийн санах ойд биш.
 */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled = false,
  loading = false,
  className,
}: AppButtonProps) {
  const [busy, setBusy] = useState(false)
  const { colors } = useAppColors()

  const inactive = disabled || loading || busy

  async function handlePress() {
    if (inactive) return
    setBusy(true)
    try {
      await onPress()
    } catch (error) {
      // Mutation-ы алдааг MutationCache toast-оор харуулсан. Энд барихгүй бол
      // unhandled rejection болж, дараагийн мөрүүд (sheet хаах) алгасагдана.
      logger.warn('AppButton onPress failed', error)
    } finally {
      setBusy(false)
    }
  }

  const content =
    loading || busy ? (
      <ActivityIndicator
        color={
          variant === 'primary' || variant === 'destructive'
            ? colors.primaryForeground
            : colors.foreground
        }
      />
    ) : (
      <>
        {icon ? (
          <AppIcon name={icon} size={iconSize.sm} tone={ICON_TONE[variant]} />
        ) : null}
        <View>
          <AppText
            variant="body"
            className={cn('font-semibold', LABEL[variant])}
          >
            {label}
          </AppText>
        </View>
      </>
    )

  const inner = 'flex-row items-center justify-center gap-2 rounded-lg px-4'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading || busy }}
      disabled={inactive}
      onPress={handlePress}
      className={cn(inactive && 'opacity-50', className)}
    >
      {variant === 'ghost' ? (
        <View className={cn(inner, HEIGHT[size])}>{content}</View>
      ) : (
        <GlassSurface
          interactive={!inactive}
          tintColor={TINT[variant](colors)}
          fallbackClassName={FALLBACK[variant]}
          className={cn(inner, HEIGHT[size])}
        >
          {content}
        </GlassSurface>
      )}
    </Pressable>
  )
}
