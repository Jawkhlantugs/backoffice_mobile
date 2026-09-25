import dayjs from 'dayjs'

import {
  currentWeek,
  emptyReport,
  joinCompletedWork,
  splitCompletedWork,
  validateReport,
} from '../weekly-report-model'

describe('weekly report', () => {
  it('долоо хоног Даваагаас Ням', () => {
    // 2026-09-25 бол Баасан.
    expect(currentWeek(dayjs('2026-09-25'))).toEqual({
      weekStart: '2026-09-21',
      weekEnd: '2026-09-27',
    })
    // Ням гараг өмнөх Даваа руу.
    expect(currentWeek(dayjs('2026-09-27')).weekStart).toBe('2026-09-21')
  })

  it('хийсэн ажлыг мөр бүрээр, "- " угтвартай', () => {
    expect(splitCompletedWork('- A\n* B\n\n C ')).toEqual(['A', 'B', 'C'])
    expect(joinCompletedWork([' A ', '', 'B'])).toBe('- A\n- B')
  })

  it('заавал талбарууд', () => {
    expect(validateReport(emptyReport())).toEqual([
      'title',
      'completedWork',
      'nextPlan',
    ])
  })
})
