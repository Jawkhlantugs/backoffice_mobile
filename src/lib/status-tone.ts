import type { StatusTone } from '@/components/status-pill'

/**
 * Backend-ийн статус үг олон янз (FILLED, SUCCESS, completed, REJECTED…) —
 * pill-ийн өнгийг утгаар нь таана. Зөвхөн өнгө; статусын утгыг өөрчлөхгүй,
 * танихгүй үг саарал үлдэнэ.
 */
const SUCCESS = /success|complete|filled|approved|done|active|verified|enabled|trading|collected|paid/i
const WARNING = /pending|new|process|waiting|partial|open|review/i
const DANGER = /fail|reject|cancel|error|expired|block|ban|disabled|break|halt/i

export function statusTone(status: string | undefined | null): StatusTone {
  if (!status) return 'neutral'
  if (DANGER.test(status)) return 'danger'
  if (SUCCESS.test(status)) return 'success'
  if (WARNING.test(status)) return 'warning'
  return 'neutral'
}
