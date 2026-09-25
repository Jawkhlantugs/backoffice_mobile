import { Pressable } from 'react-native'

import { AppIcon, AppText, GlassSurface, type AppIconName } from '@/components'
import { iconSize } from '@/theme/tokens'

/** Нүүрний түргэн үйлдлийн glass хайрцаг — дүрс дээр, шошго доор. */
export function QuickAction({
  label,
  icon,
  onPress,
}: {
  label: string
  icon: AppIconName
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-1"
    >
      <GlassSurface
        interactive
        fallbackClassName="border border-border bg-card"
        className="items-center gap-2 rounded-2xl px-2 py-3.5"
      >
        <AppIcon name={icon} size={iconSize.lg} tone="default" />
        <AppText variant="caption" numberOfLines={2} className="text-center">
          {label}
        </AppText>
      </GlassSurface>
    </Pressable>
  )
}
