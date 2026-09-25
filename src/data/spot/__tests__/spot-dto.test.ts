import { toSpotFill, toSpotOrder } from '../spot-dto'

describe('spot dto', () => {
  it('захиалгын үнийг quote валютаар, хэрэглэгчийг имэйлээр', () => {
    const order = toSpotOrder({
      id: 'o1',
      symbol: { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
      price: '65000.5',
      cummulativeQuoteQty: '130001',
      executedQty: '2',
      brokerUser: { email: 'a@x.mn' },
    })
    expect(order.symbol).toBe('BTCUSDT')
    expect(order.price).toEqual({ raw: '65000.5', currency: 'USDT' })
    expect(order.user).toBe('a@x.mn')
  })

  it('0/1 тугийг boolean, шимтгэлгүй бол undefined', () => {
    const fill = toSpotFill({
      id: 'f1',
      symbolId: 'ETHUSDT',
      isBuyer: 1,
      isMaker: 0,
    })
    expect(fill.symbol).toBe('ETHUSDT')
    expect(fill.isBuyer).toBe(true)
    expect(fill.isMaker).toBe(false)
    expect(fill.commission).toBeUndefined()
  })
})
