import { View } from 'react-native'

import { cn } from '@/lib/cn'

import { AppText } from './app-text'

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

/**
 * Дэвсгэр нь тусдаа токен — `bg-success/15` шиг alpha modifier нь CSS
 * хувьсагчаар тодорхойлсон өнгөнд ажиллахгүй (Tailwind нь суваг тус бүрийг
 * мэдэх шаардлагатай), дэвсгэргүй pill үлддэг.
 */
const TONE: Record<StatusTone, string> = {
  neutral: 'bg-muted',
  success: 'bg-success-subtle',
  warning: 'bg-warning-subtle',
  danger: 'bg-destructive-subtle',
  info: 'bg-accent',
}

const TONE_TEXT: Record<StatusTone, string> = {
  neutral: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
  info: 'text-primary',
}

const TONE_DOT: Record<StatusTone, string> = {
  neutral: 'bg-muted-foreground',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-primary',
}

/** Статус нь өнгөний хажуугаар цэг, текстээр ч ялгарна (§14). */
export function StatusPill({
  label,
  tone = 'neutral',
  dot = true,
  className,
}: {
  label: string
  tone?: StatusTone
  dot?: boolean
  className?: string
}) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-1',
        TONE[tone],
        className,
      )}
    >
      {dot ? (
        <View className={cn('h-1.5 w-1.5 rounded-full', TONE_DOT[tone])} />
      ) : null}
      <AppText variant="caption" className={cn('font-medium', TONE_TEXT[tone])}>
        {label}
      </AppText>
    </View>
  )
}
