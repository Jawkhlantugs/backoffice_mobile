import type { FilterChip, StatusTone } from '@/components'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

export const ALL = 'all'

/** Backend-ийн жижиг үсэгтэй статусыг орчуулна; танихгүйг хэвээр. */
export function partnerStatus(status: string): {
  label: string
  tone: StatusTone
} {
  const labels: Record<string, string> = messages.partner.statuses
  return { label: labels[status] ?? status, tone: statusTone(status) }
}

export const partnerStatusChips = (
  statuses: readonly string[],
): FilterChip<string>[] => [
  { value: ALL, label: messages.common.all },
  ...statuses.map((value) => ({ value, label: partnerStatus(value).label })),
]
