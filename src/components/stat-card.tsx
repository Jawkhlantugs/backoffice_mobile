import { Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon, type AppIconName, type IconTone } from './app-icon'
import { AppText } from './app-text'
import { Skeleton } from './skeleton'

/**
 * Нүүрний тоон хайрцаг. Утга ачаалж байвал тоо биш skeleton харагдана —
 * "0" гэж хуурамч утга харуулахгүй.
 */
export function StatCard({
  label,
  value,
  icon,
  tone = 'muted',
  loading = false,
  onPress,
  className,
}: {
  label: string
  value: number | string
  icon: AppIconName
  tone?: IconTone
  loading?: boolean
  onPress?: () => void
  className?: string
}) {
  const content = (
    <View
      className={cn(
        'flex-1 gap-3 rounded-xl border border-border bg-card p-4',
        className,
      )}
    >
      <AppIcon name={icon} size={iconSize.md} tone={tone} />

      {loading ? (
        <Skeleton className="h-8 w-12" />
      ) : (
        <AppText variant="display" numeric>
          {value}
        </AppText>
      )}

      <AppText variant="caption" numberOfLines={2}>
        {label}
      </AppText>
    </View>
  )

  if (onPress === undefined) return content

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-1"
    >
      {content}
    </Pressable>
  )
}
