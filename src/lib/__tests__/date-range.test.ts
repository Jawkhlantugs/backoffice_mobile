import dayjs from 'dayjs'

import { recentRange } from '../date-range'

describe('recentRange', () => {
  const today = dayjs('2026-10-01')

  it('сар нь вэбийн defaultMonths: 1-тэй ижил', () => {
    expect(recentRange('month', today)).toEqual({
      start_day: '2026-09-01',
      end_day: '2026-10-01',
    })
  })

  it('долоо хоног, улирал', () => {
    expect(recentRange('week', today).start_day).toBe('2026-09-24')
    expect(recentRange('quarter', today).start_day).toBe('2026-07-01')
  })
})
