import type { StatusTone } from '@/components/status-pill'

/** Вэбийн `components/ui/badge.tsx`-ийн variant-ууд. */
export type WebBadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'destructive'
  | 'default'
  | 'secondary'
  | 'outline'

/** Вэбийн Badge-ийн өнгө → `StatusPill`. outline/secondary/default нь саарал. */
export function badgeTone(variant: WebBadgeVariant): StatusTone {
  switch (variant) {
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'error':
    case 'destructive':
      return 'danger'
    default:
      return 'neutral'
  }
}

export type WebStatusCategory =
  | 'bank'
  | 'exchange'
  | 'crypto-deposit'
  | 'crypto-withdraw'
  | 'crypto-transfer'
  | 'kyc'
  | 'spot-order'
  | 'spot-symbol'

/**
 * Вэбийн `utils/status-styles.ts`-ийн `getStatusBadgeVariant` — хүснэгтийн
 * статусын өнгө вэбтэй яг ижил байх ёстой. Тоон кодууд нь
 * `constants/status.ts`-ийн enum.
 */
export function webStatusVariant(
  status: string | number | null | undefined,
  category: WebStatusCategory,
): WebBadgeVariant {
  if (status === null || status === undefined || status === '') {
    return 'warning'
  }
  const upper = typeof status === 'string' ? status.toUpperCase() : status
  const code = typeof status === 'string' ? parseInt(status, 10) : status

  switch (category) {
    case 'bank':
      if (upper === 'TRANSFERRED') return 'success'
      if (upper === 'REFUNDED' || upper === 'CANCELLED') return 'error'
      return 'warning'
    case 'exchange': {
      const lower = String(status).toLowerCase()
      if (lower === 'completed') return 'success'
      if (lower === 'error' || lower === 'timeout') return 'error'
      return 'warning'
    }
    case 'crypto-deposit': {
      const value = String(status)
      if (value === 'Completed' || value === '1') return 'success'
      if (value === 'Failed' || value === 'CANCELLED') return 'error'
      return 'warning'
    }
    case 'crypto-withdraw':
      if (code === 1) return 'success'
      if (code === 8) return 'error'
      if (code === 5) return 'warning'
      if (code === 7) return 'default'
      return 'warning'
    case 'crypto-transfer':
      if (code === 6) return 'success'
      if (code === -1) return 'error'
      if (code === 3) return 'warning'
      if (code === 4) return 'default'
      return 'warning'
    case 'kyc':
      if (upper === 'SUCCESS') return 'success'
      if (upper === 'FAILED') return 'error'
      return 'warning'
    case 'spot-order':
      if (upper === 'FILLED') return 'success'
      if (upper === 'CANCELED' || upper === 'EXPIRED') return 'error'
      if (upper === 'NEW' || upper === 'PARTIALLY_FILLED') return 'warning'
      return 'default'
    case 'spot-symbol':
      if (upper === 'TRADING') return 'success'
      if (upper === 'BREAK') return 'error'
      return 'warning'
  }
}

export function webStatusTone(
  status: string | number | null | undefined,
  category: WebStatusCategory,
): StatusTone {
  return badgeTone(webStatusVariant(status, category))
}
