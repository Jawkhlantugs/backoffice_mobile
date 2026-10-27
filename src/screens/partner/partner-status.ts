import type { FilterChip, StatusTone } from '@/components'
import { messages } from '@/lib/messages'

export const ALL = 'all'

/**
 * Вэбийн жагсаалт бүрийн `get*StatusVariant` — ижил үг (`pending`,
 * `approved`) жагсаалтаас хамаарч өөр өнгөтэй тул тус тусад нь.
 */
export const PARTNER_TONES = {
  partners: { active: 'success', suspended: 'danger', pending: 'warning' },
  applications: { approved: 'success', rejected: 'danger', pending: 'warning' },
  commissions: { cancelled: 'danger' },
  payouts: { pending: 'warning', completed: 'success', failed: 'danger' },
  referrals: { active: 'success', registered: 'warning' },
} as const satisfies Record<string, Record<string, StatusTone>>

/** Backend-ийн жижиг үсэгтэй статусыг орчуулна; танихгүйг хэвээр. */
export function partnerStatus(
  status: string,
  tones: Readonly<Record<string, StatusTone>> = {},
): {
  label: string
  tone: StatusTone
} {
  const labels: Record<string, string> = messages.partner.statuses
  return { label: labels[status] ?? status, tone: tones[status] ?? 'neutral' }
}

export const partnerStatusChips = (
  statuses: readonly string[],
): FilterChip<string>[] => [
  { value: ALL, label: messages.common.all },
  ...statuses.map((value) => ({ value, label: partnerStatus(value).label })),
]
