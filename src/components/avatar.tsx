import { View } from 'react-native'

import { cn } from '@/lib/cn'

import { AppText } from './app-text'

/** Имэйл эсвэл нэрнээс эхний хоёр үсэг — зураг татах endpoint байхгүй. */
function initials(source: string | undefined): string {
  const clean = (source ?? '').trim()
  if (clean.length === 0) return '—'

  const name = clean.split('@')[0] ?? clean
  const parts = name.split(/[.\-_\s]+/).filter((part) => part.length > 0)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''

  return (first + second).toUpperCase() || name.slice(0, 2).toUpperCase()
}

export function Avatar({
  source,
  size = 'md',
  className,
}: {
  /** Имэйл эсвэл харагдах нэр. */
  source: string | undefined
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const box =
    size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10'

  return (
    <View
      className={cn(
        'items-center justify-center rounded-full border border-border bg-muted',
        box,
        className,
      )}
    >
      <AppText
        variant={size === 'lg' ? 'title' : 'caption'}
        className="font-semibold text-foreground"
      >
        {initials(source)}
      </AppText>
    </View>
  )
}
