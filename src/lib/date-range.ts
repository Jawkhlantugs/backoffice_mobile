import dayjs from 'dayjs'

/** Вэбийн `useFilterParams`-ийн `sortDate` хэлбэр. */
export type DayRange = { start_day: string; end_day: string }

export const RANGE_PERIODS = ['week', 'month', 'quarter'] as const
export type RangePeriod = (typeof RANGE_PERIODS)[number]

const DAY_FORMAT = 'YYYY-MM-DD'

/** Өнөөдрөөс хойш тоолсон хугацаа — вэбийн `defaultMonths` (1 сар) анхдагч. */
export function recentRange(period: RangePeriod, today = dayjs()): DayRange {
  const start =
    period === 'week'
      ? today.subtract(7, 'day')
      : today.subtract(period === 'month' ? 1 : 3, 'month')
  return {
    start_day: start.format(DAY_FORMAT),
    end_day: today.format(DAY_FORMAT),
  }
}
