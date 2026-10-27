import { formatRelativeTime } from '../date'
import { messages } from '../messages'

const NOW = Date.parse('2026-10-26T14:00:00Z')
const text = () => messages.relativeTime

describe('formatRelativeTime', () => {
  it('нэг минут хүрэхгүй бол "дөнгөж сая"', () => {
    expect(formatRelativeTime('2026-10-26T13:59:30Z', NOW)).toBe(
      text().justNow,
    )
  })

  it('минут, цаг, өдрөөр тоолно', () => {
    expect(formatRelativeTime('2026-10-26T13:48:00Z', NOW)).toBe(
      `12 ${text().minutesAgo}`,
    )
    expect(formatRelativeTime('2026-10-26T11:00:00Z', NOW)).toBe(
      `3 ${text().hoursAgo}`,
    )
    expect(formatRelativeTime('2026-10-24T14:00:00Z', NOW)).toBe(
      `2 ${text().daysAgo}`,
    )
  })

  it('unix секундыг ч уншина', () => {
    expect(formatRelativeTime(NOW / 1000 - 120, NOW)).toBe(
      `2 ${text().minutesAgo}`,
    )
  })

  it('ирээдүйн болон буруу огноог хамгаална', () => {
    expect(formatRelativeTime('2026-10-27T00:00:00Z', NOW)).toBe(
      text().justNow,
    )
    expect(formatRelativeTime('not a date', NOW)).toBe('-')
    expect(formatRelativeTime(undefined, NOW)).toBe('-')
  })
})
