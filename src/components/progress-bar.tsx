import { View } from 'react-native'

import { cn } from '@/lib/cn'

const MAX_PERCENT = 100

/** Явцын мөр — 0–100. Өнгө нь утга: дууссан бол ногоон, бусад нь primary. */
export function ProgressBar({
  percent,
  className,
}: {
  percent: number
  className?: string
}) {
  const clamped = Math.max(0, Math.min(MAX_PERCENT, percent))
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: MAX_PERCENT, now: clamped }}
      className={cn('h-1.5 overflow-hidden rounded-full bg-muted', className)}
    >
      <View
        className={cn(
          'h-full rounded-full',
          clamped === MAX_PERCENT ? 'bg-success' : 'bg-primary',
        )}
        style={{ width: `${clamped}%` }}
      />
    </View>
  )
}
