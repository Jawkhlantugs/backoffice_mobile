import { toUserCurrentBalance } from '../user-balance-dto'

describe('toUserCurrentBalance', () => {
  it('asset тус бүрийн free/freeze-ийг тухайн asset-ийн валютаар холбоно', () => {
    const balance = toUserCurrentBalance({
      spot: [{ asset: 'BTC', free: 0.5, freeze: 0, usdtValuation: 30000 }],
    })

    expect(balance.spot[0]?.free).toEqual({ raw: 0.5, currency: 'BTC' })
    expect(balance.spot[0]?.usdtValuation).toEqual({
      raw: 30000,
      currency: 'USDT',
    })
  })

  it('дэд массив байхгүй бол хоосон массив буцаана', () => {
    const balance = toUserCurrentBalance({})
    expect(balance.spot).toEqual([])
    expect(balance.futures).toEqual([])
    expect(balance.fiat).toEqual([])
  })

  it('нийт үнэлгээг total.overall-оос авна', () => {
    const balance = toUserCurrentBalance({
      total: { overall: { usdtValuation: 100, mntValuation: 350000 } },
    })
    expect(balance.totalUsdtValuation).toEqual({ raw: 100, currency: 'USDT' })
    expect(balance.totalMntValuation).toEqual({ raw: 350000, currency: 'MNT' })
  })
})
