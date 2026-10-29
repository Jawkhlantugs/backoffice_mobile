import { dayTimeRange } from '../day-time-range'

describe('dayTimeRange', () => {
  it('нэг өдөр сонгоход тэр өдрийг бүтнээр нь хамарна', () => {
    expect(dayTimeRange('2026-10-28', '2026-10-28')).toEqual({
      startTime: Date.UTC(2026, 9, 28),
      endTime: Date.UTC(2026, 9, 29) - 1,
    })
  })

  it('нэг тал нь дутуу бол огноогоор шүүхгүй', () => {
    expect(dayTimeRange('2026-10-28', undefined)).toEqual({})
    expect(dayTimeRange(undefined, undefined)).toEqual({})
  })
})
