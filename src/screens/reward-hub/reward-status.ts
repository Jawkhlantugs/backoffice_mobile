import type { FilterChip, StatusTone } from '@/components'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

export const ALL = 'all'

/**
 * Вэбийн `getUserRewardStatusVariant`, `getTransactionTaskStatusVariant` —
 * хоёр жагсаалтын статус давхцахгүй тул нэг газар.
 */
const TONE: Record<string, StatusTone> = {
  COMPLETED: 'success',
  CLAIMED: 'success',
  REQUESTED: 'warning',
  IN_PROGRESS: 'warning',
  PENDING: 'warning',
  PROCESSING: 'warning',
  EXPIRED: 'danger',
  FAILED: 'danger',
}

export function rewardStatus(status: string): {
  label: string
  tone: StatusTone
} {
  return {
    label: labelOf(messages.rewardHub.statuses, status) ?? status,
    tone: TONE[status] ?? 'neutral',
  }
}

export const rewardStatusChips = (
  statuses: readonly string[],
): FilterChip<string>[] => [
  { value: ALL, label: messages.common.all },
  ...statuses.map((value) => ({ value, label: rewardStatus(value).label })),
]
