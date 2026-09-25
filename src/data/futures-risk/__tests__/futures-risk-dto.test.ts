import { toFuturesMasterRisk, toFuturesOpenOrder } from '../futures-risk-dto'

describe('toFuturesMasterRisk', () => {
  it('0 positionAmt-тэй позицуудыг шүүнэ (хаагдсан гэсэн үг)', () => {
    const risk = toFuturesMasterRisk({
      positions: [
        { symbol: 'BTCUSDT', positionAmt: '0' },
        { symbol: 'ETHUSDT', positionAmt: '1.5' },
      ],
    })
    expect(risk.positions).toHaveLength(1)
    expect(risk.positions[0]?.symbol).toBe('ETHUSDT')
  })

  it('дүнгүүдийг USDT валюттай AmountField болгоно', () => {
    const risk = toFuturesMasterRisk({ totalWalletBalance: '1000.5' })
    expect(risk.totalWalletBalance).toEqual({ raw: '1000.5', currency: 'USDT' })
  })
})

describe('toFuturesOpenOrder', () => {
  it('орлого дутуу талбаруудыг аюулгүй анхны утгаар дүүргэнэ', () => {
    const order = toFuturesOpenOrder({})
    expect(order.orderId).toBe(0)
    expect(order.symbol).toBe('')
  })
})
