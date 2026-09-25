import { View } from 'react-native'

import { cn } from '@/lib/cn'

import { AppText } from './app-text'

export type BadgeTone = 'neutral' | 'primary' | 'danger' | 'warning' | 'success'

const TONE: Record<BadgeTone, string> = {
  neutral: 'bg-muted',
  primary: 'bg-primary',
  danger: 'bg-destructive',
  warning: 'bg-warning',
  success: 'bg-success',
}

const TONE_TEXT: Record<BadgeTone, string> = {
  neutral: 'text-muted-foreground',
  primary: 'text-primary-foreground',
  danger: 'text-destructive-foreground',
  warning: 'text-warning-foreground',
  success: 'text-success-foreground',
}

/** Тоон тэмдэглэгээ — цэс, таб дээрх "хүлээгдэж буй 3". */
export function Badge({
  value,
  tone = 'neutral',
  className,
}: {
  value: number | string
  tone?: BadgeTone
  className?: string
}) {
  return (
    <View
      className={cn(
        'h-5 min-w-5 items-center justify-center rounded-full px-1.5',
        TONE[tone],
        className,
      )}
    >
      <AppText
        variant="caption"
        numeric
        className={cn('text-tiny font-semibold', TONE_TEXT[tone])}
      >
        {value}
      </AppText>
    </View>
  )
}
