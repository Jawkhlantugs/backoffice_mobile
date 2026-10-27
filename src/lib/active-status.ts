import type { StatusTone } from '@/components/status-pill'
import { messages } from '@/lib/messages'

/**
 * `isActive` / `is_active` / `enabled` туг — pill-ийн шошго, өнгө. Вэб
 * идэвхтэйг өнгөгүй (default Badge) харуулдаг дэлгэцэд `activeTone: 'neutral'`.
 */
export function activeStatus(
  active: boolean,
  activeTone: StatusTone = 'success',
): {
  label: string
  tone: StatusTone
} {
  return active
    ? { label: messages.common.active, tone: activeTone }
    : { label: messages.common.inactive, tone: 'neutral' }
}
