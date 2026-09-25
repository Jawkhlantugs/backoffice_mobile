import { Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon } from './app-icon'
import { AppText } from './app-text'

/** Хэсгийн гарчиг + баруун талын нэмэлт үйлдэл ("Бүгдийг харах"). */
export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string
  action?: { label: string; onPress: () => void }
  className?: string
}) {
  return (
    <View
      className={cn('flex-row items-center justify-between gap-3', className)}
    >
      <AppText variant="tiny" className="uppercase tracking-wider">
        {title}
      </AppText>

      {action ? (
        <Pressable
          accessibilityRole="button"
          onPress={action.onPress}
          className="flex-row items-center gap-1 py-1"
        >
          <AppText variant="caption" className="font-medium text-foreground">
            {action.label}
          </AppText>
          <AppIcon name="forward" size={iconSize.xs} tone="muted" />
        </Pressable>
      ) : null}
    </View>
  )
}
