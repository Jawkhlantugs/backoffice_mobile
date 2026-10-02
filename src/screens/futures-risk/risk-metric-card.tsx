import { View } from 'react-native'

import {
  AppCard,
  AppIcon,
  AppText,
  Skeleton,
  type AppIconName,
} from '@/components'
import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

export type MetricTone = 'default' | 'positive' | 'negative'

const TONE: Record<MetricTone, string> = {
  default: 'text-foreground',
  positive: 'text-success',
  negative: 'text-destructive',
}

/**
 * Бүтэн өргөнтэй тоон карт. Master дансны дүн 5+ оронтой тул `StatCard`-ийн
 * нарийн торонд тоо мөр мөрөөр тасарч уншигдахаа больдог байсан.
 */
export function RiskMetricCard({
  label,
  icon,
  value,
  unit,
  tone = 'default',
  loading = false,
}: {
  label: string
  icon: AppIconName
  value: string
  unit?: string
  tone?: MetricTone
  loading?: boolean
}) {
  return (
    <AppCard className="gap-2">
      <View className="flex-row items-center gap-2">
        <AppIcon name={icon} size={iconSize.sm} tone="muted" />
        <AppText variant="caption">{label}</AppText>
      </View>

      {loading ? (
        <Skeleton className="h-8 w-40" />
      ) : (
        <View className="flex-row items-baseline gap-1.5">
          <AppText
            variant="display"
            numeric
            numberOfLines={1}
            adjustsFontSizeToFit
            className={cn('shrink', TONE[tone])}
          >
            {value}
          </AppText>
          {unit ? (
            <AppText variant="caption" className="font-medium">
              {unit}
            </AppText>
          ) : null}
        </View>
      )}
    </AppCard>
  )
}
