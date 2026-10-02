import { toConvertLimitOrder } from '../convert-limit-dto'

describe('convert limit dto', () => {
  it('дүн нь from, хүлээгдэх дүн нь to валютаар', () => {
    const order = toConvertLimitOrder({
      id: 'c1',
      fromAsset: 'USDT',
      toAsset: 'MNT',
      currentAmount: 1000,
      currentRate: 3450.5,
      expectedToAmount: 3450500,
      offers: [{}, {}],
    })
    expect(order.amount).toEqual({ raw: 1000, currency: 'USDT' })
    expect(order.expectedTo).toEqual({ raw: 3450500, currency: 'MNT' })
    expect(order.rate).toBe('3450.5')
    expect(order.offers).toBe(2)
    expect(order.agreedAmount).toBeUndefined()
  })
})
