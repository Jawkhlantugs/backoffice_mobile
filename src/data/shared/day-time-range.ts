const DAY_MS = 24 * 60 * 60 * 1000

/**
 * `start_day`/`end_day` → `startTime`/`endTime` (UTC ms). Вэбийн `toListRequest`
 * дуусах өдрийг шөнө дундаар явуулдаг тул нэг өдөр сонгоход хоосон гардаг —
 * энд дуусах өдрийг бүтнээр нь (23:59:59.999) авна.
 */
export function dayTimeRange(start_day?: string, end_day?: string) {
  const start = start_day ? Date.parse(start_day) : NaN
  const end = end_day ? Date.parse(end_day) : NaN
  if (Number.isNaN(start) || Number.isNaN(end)) return {}
  return { startTime: start, endTime: end + DAY_MS - 1 }
}
