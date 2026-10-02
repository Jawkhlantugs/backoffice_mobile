import type { StatusTone } from '@/components/status-pill'
import { messages } from '@/lib/messages'

/** `isActive` / `is_active` / `enabled` туг — pill-ийн шошго, өнгө. */
export function activeStatus(active: boolean): {
  label: string
  tone: StatusTone
} {
  return active
    ? { label: messages.common.active, tone: 'success' }
    : { label: messages.common.inactive, tone: 'neutral' }
}
