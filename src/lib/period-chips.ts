import type { FilterChip } from '@/components/filter-chips'
import { RANGE_PERIODS, type RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'

/** Вэбийн огнооны мужийн шүүлтүүрийн утасны хувилбар — анхдагч 1 сар. */
export const DEFAULT_PERIOD: RangePeriod = 'month'

export const periodChips = (): FilterChip<RangePeriod>[] =>
  RANGE_PERIODS.map((value) => ({ value, label: messages.periods[value] }))
