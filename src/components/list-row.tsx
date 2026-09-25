import { Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon, type AppIconName } from './app-icon'
import { AppText } from './app-text'

export type ListRowProps = {
  title: string
  subtitle?: string
  /** Дүрс нь өнгөгүй — вэб админтай ижил (§15). */
  icon?: AppIconName
  /** Баруун талд гарах тоо, шошго. */
  trailing?: React.ReactNode
  /** `undefined` бол мөр идэвхгүй — дарагдахгүй, бүдэг харагдана. */
  onPress?: () => void
  /** Дээрээ зураас — картын дотор дараалсан мөрүүдэд. */
  divider?: boolean
  active?: boolean
  className?: string
}

/**
 * Жагсаалтын нэг мөр — цэс, тохиргоо бүх газарт нэг л хэлбэртэй.
 * Өндөр нь 44pt-ээс багагүй (§14).
 */
export function ListRow({
  title,
  subtitle,
  icon,
  trailing,
  onPress,
  divider = false,
  active = false,
  className,
}: ListRowProps) {
  const disabled = onPress === undefined

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        'min-h-14 flex-row items-center gap-3 px-4 py-2.5',
        divider && 'border-t border-border',
        active && 'bg-accent',
        className,
      )}
    >
      {icon ? (
        <AppIcon
          name={icon}
          size={iconSize.md}
          tone={disabled ? 'muted' : 'default'}
        />
      ) : null}

      <View className="flex-1 gap-0.5">
        <AppText
          variant="body"
          numberOfLines={1}
          className={cn(disabled ? 'text-muted-foreground' : 'text-foreground')}
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {trailing}

      {disabled ? null : (
        <AppIcon name="forward" size={iconSize.sm} tone="muted" />
      )}
    </Pressable>
  )
}
