import { withSortDate } from '../sort-date'

describe('withSortDate', () => {
  it('хоёр огноо байвал sortDate болгоно', () => {
    expect(
      withSortDate({ id: '1', start_day: '2026-10-01', end_day: '2026-10-27' }),
    ).toEqual({
      id: '1',
      sortDate: { start_day: '2026-10-01', end_day: '2026-10-27' },
    })
  })

  it('нэг нь дутуу бол sortDate илгээхгүй', () => {
    expect(withSortDate({ start_day: '2026-10-01' }).sortDate).toBeUndefined()
  })
})
