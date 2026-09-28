import dayjs from 'dayjs'

import { messages } from '@/lib/messages'

/**
 * Огнооны бичиг. Вэб админы `formatDate()`-тэй ижил дүрэм: 1e12-оос их тоо
 * миллисекунд, бага нь Unix секунд.
 */
export function formatDate(
  date: string | Date | number | null | undefined,
  format = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (date === null || date === undefined) return '-'
  try {
    const value =
      typeof date === 'number' && date <= 1e12 ? dayjs.unix(date) : dayjs(date)
    return value.isValid() ? value.format(format) : '-'
  } catch {
    return '-'
  }
}

export const formatDateOnly = (date: Parameters<typeof formatDate>[0]) =>
  formatDate(date, 'YYYY-MM-DD')

export const formatTimeOnly = (date: Parameters<typeof formatDate>[0]) =>
  formatDate(date, 'HH:mm')

const MS_PER_MINUTE = 60_000
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24

/** Барьсан хугацаа — "2ө 3ц", "45м". Futures позиц гэх мэт. */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / MS_PER_MINUTE)
  const hours = Math.floor(minutes / MINUTES_PER_HOUR)
  const days = Math.floor(hours / HOURS_PER_DAY)
  const { days: d, hours: h, minutes: m } = messages.units
  if (days > 0) return `${days}${d} ${hours % HOURS_PER_DAY}${h}`
  if (hours > 0) return `${hours}${h} ${minutes % MINUTES_PER_HOUR}${m}`
  return `${minutes}${m}`
}
