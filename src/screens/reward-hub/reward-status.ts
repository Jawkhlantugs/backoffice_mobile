import type { FilterChip, StatusTone } from '@/components'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

export const ALL = 'all'

export function rewardStatus(status: string): {
  label: string
  tone: StatusTone
} {
  return {
    label: labelOf(messages.rewardHub.statuses, status) ?? status,
    tone: statusTone(status),
  }
}

export const rewardStatusChips = (
  statuses: readonly string[],
): FilterChip<string>[] => [
  { value: ALL, label: messages.common.all },
  ...statuses.map((value) => ({ value, label: rewardStatus(value).label })),
]
