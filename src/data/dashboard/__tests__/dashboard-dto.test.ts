import { toDashboardSummary } from '../dashboard-dto'

describe('dashboard dto', () => {
  it('MNT дүнгүүдийг AmountField болгож, тоог хэвээр', () => {
    const summary = toDashboardSummary({
      totalUsers: 10,
      totalRevenueMnt: 1500000.5,
    })
    expect(summary.totalUsers).toBe(10)
    expect(summary.revenue).toEqual({ raw: 1500000.5, currency: 'MNT' })
    expect(summary.arpu).toEqual({ raw: 0, currency: 'MNT' })
  })
})
