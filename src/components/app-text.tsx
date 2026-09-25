import { Text, type TextProps } from 'react-native'

import { cn } from '@/lib/cn'

type Variant =
  | 'display'
  | 'heading'
  | 'title'
  | 'body'
  | 'bodyLarge'
  | 'caption'
  | 'label'
  | 'tiny'

/** Хэмжээ, жин — өнгө тусдаа (доор). */
const VARIANTS: Record<Variant, string> = {
  display: 'text-display font-bold',
  heading: 'text-heading font-semibold',
  title: 'text-title font-semibold',
  bodyLarge: 'text-body-lg',
  body: 'text-body',
  caption: 'text-caption',
  label: 'text-caption font-medium',
  tiny: 'text-tiny font-medium',
}

const DEFAULT_COLOR: Record<Variant, string> = {
  display: 'text-foreground',
  heading: 'text-foreground',
  title: 'text-foreground',
  bodyLarge: 'text-foreground',
  body: 'text-foreground',
  caption: 'text-muted-foreground',
  label: 'text-muted-foreground',
  tiny: 'text-muted-foreground',
}

/** Хэмжээний токен биш `text-*` = өнгө. */
const SIZE_TOKENS = new Set(['display', 'heading', 'title', 'body', 'body-lg', 'caption', 'tiny'])
const ALIGN = new Set(['left', 'center', 'right', 'justify'])

/**
 * NativeWind дээр хоёр өнгө зэрэг байвал CSS-ийн дараалал шийддэг, className-ийн
 * дараалал биш — тиймээс дуудагч өнгө өгвөл variant-ийн өнгийг огт нэмэхгүй.
 */
function hasColor(className: string | undefined): boolean {
  return (className ?? '').split(/\s+/).some((token) => {
    const match = /^text-(.+)$/.exec(token)
    return match !== null && !SIZE_TOKENS.has(match[1] ?? '') && !ALIGN.has(match[1] ?? '')
  })
}

export type AppTextProps = TextProps & {
  variant?: Variant
  /**
   * Дүн, ID зэрэг цифр эгнүүлэх ёстой текст. Tabular тоо нь жагсаалтад
   * баганаар тэгширнэ.
   */
  numeric?: boolean
}

export function AppText({
  variant = 'body',
  numeric = false,
  className,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={cn(VARIANTS[variant], !hasColor(className) && DEFAULT_COLOR[variant], className)}
      style={[numeric && { fontVariant: ['tabular-nums'] }, style]}
      {...rest}
    />
  )
}
