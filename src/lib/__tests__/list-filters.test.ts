import dayjs from 'dayjs'

import { activeFilterCount, withDefaultRange } from '../list-filters'

const today = dayjs().format('YYYY-MM-DD')

describe('activeFilterCount', () => {
  it('undefined утгыг тоолохгүй, огнооны мужийг нэг гэж тоолно', () => {
    expect(activeFilterCount({})).toBe(0)
    expect(
      activeFilterCount({
        orderId: 'a',
        toAsset: undefined,
        start_day: '2026-10-01',
        end_day: '2026-10-27',
      }),
    ).toBe(2)
  })
})

describe('activeFilterCount — дүнгийн нөхцөл', () => {
  it('*Condition түлхүүрийг тоолохгүй', () => {
    expect(
      activeFilterCount({ amount: '1', amountCondition: 'GREATER_THAN' }),
    ).toBe(1)
  })
})

describe('withDefaultRange', () => {
  it('огноо сонгоогүй бол хэвээр', () => {
    expect(withDefaultRange({ status: 'NEW' })).toEqual({ status: 'NEW' })
  })

  it('нэг тал дутуу бол өнөөдрөөр нөхнө (вэбийн useFilterParams)', () => {
    expect(withDefaultRange({ start_day: '2026-10-01' })).toEqual({
      start_day: '2026-10-01',
      end_day: today,
    })
    expect(withDefaultRange({ end_day: '2026-10-20' })).toEqual({
      start_day: today,
      end_day: '2026-10-20',
    })
  })
})
