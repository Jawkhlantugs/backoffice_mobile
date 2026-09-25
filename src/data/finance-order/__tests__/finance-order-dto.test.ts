import { toFinanceOrder } from '../finance-order-dto'

describe('toFinanceOrder', () => {
  it('quantity/executedQty/remaining нь baseAsset, price/amount нь quoteAsset-тай холбогдоно', () => {
    const order = toFinanceOrder({
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      quantity: 0.5,
      price: 60000,
    })

    expect(order.quantity).toEqual({ raw: 0.5, currency: 'BTC' })
    expect(order.price).toEqual({ raw: 60000, currency: 'USDT' })
  })

  it('amount нь null ирвэл undefined болно', () => {
    expect(toFinanceOrder({ amount: null }).amount).toBeUndefined()
    expect(toFinanceOrder({}).amount).toBeUndefined()
  })

  it('танихгүй side/type-г аюулгүй анхны утга руу буулгана', () => {
    const order = toFinanceOrder({ side: 'HOLD', type: 'STOP' })
    expect(order.side).toBe('BUY')
    expect(order.type).toBe('LIMIT')
  })
})
