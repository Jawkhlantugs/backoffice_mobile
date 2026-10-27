import dayjs from 'dayjs'

/**
 * Шүүлтүүрийн sheet-ийн утга: текст талбарууд түлхүүрээрээ, огнооны муж
 * вэбийн адил `start_day`/`end_day` (`YYYY-MM-DD`).
 */
export type ListFilters = Record<string, string | undefined>

/**
 * "Шүүлтүүр арилгах (2)" — огнооны муж нэг шүүлтүүр. Дүнгийн нөхцөл
 * (`amountCondition` г.м.) дүнгийнхээ хамт л утгатай тул тоологдохгүй.
 */
export function activeFilterCount({
  start_day,
  end_day,
  ...rest
}: ListFilters) {
  const fields = Object.entries(rest).filter(
    ([key, value]) => value !== undefined && !key.endsWith('Condition'),
  )
  return fields.length + (start_day || end_day ? 1 : 0)
}

/**
 * Вэбийн `useFilterParams` (`defaultMonths: 0`): муж нэг талдаа л сонгогдвол
 * нөгөөг нь өнөөдрөөр нөхнө.
 */
export function withDefaultRange(filters: ListFilters): ListFilters {
  if (!filters.start_day && !filters.end_day) return filters
  const today = dayjs().format('YYYY-MM-DD')
  return {
    ...filters,
    start_day: filters.start_day ?? today,
    end_day: filters.end_day ?? today,
  }
}
