import { Pressable, View, type ViewProps } from 'react-native'

import { cn } from '@/lib/cn'

/**
 * Контентын хайрцаг. `elevated` нь дэвсгэрээс нэг шат дээш — sheet, drawer
 * зэрэг картан дээр давхарлагдах гадаргууд. `onPress` өгвөл бүхэлдээ
 * дарагдана — карт бүрт `Pressable` ороохгүй.
 *
 * Карт glass биш: жагсаалтын олон мөр дээр glass нь уншигдах байдал, гүйцэтгэлийг
 * муутгана. Glass нь хөвөгч удирдлагад л (`GlassSurface`).
 */
export function AppCard({
  className,
  variant = 'card',
  onPress,
  onLongPress,
  accessibilityLabel,
  ...rest
}: ViewProps & {
  variant?: 'card' | 'elevated'
  onPress?: () => void
  /** Нэмэлт үйлдлийн хавтан (төлөв солих гэх мэт). */
  onLongPress?: () => void
}) {
  const card = (
    <View
      className={cn(
        'rounded-xl border border-border p-4',
        variant === 'elevated' ? 'bg-elevated' : 'bg-card',
        className,
      )}
      accessibilityLabel={onPress ? undefined : accessibilityLabel}
      {...rest}
    />
  )

  if (!onPress) return card

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      className="active:opacity-80"
    >
      {card}
    </Pressable>
  )
}
