import { orderLimit } from '../finance-order-model'

describe('orderLimit', () => {
  it('вэбийн адил 1–100 хооронд, анхдагч 20', () => {
    expect(orderLimit(undefined)).toBe(20)
    expect(orderLimit('abc')).toBe(20)
    expect(orderLimit('50')).toBe(50)
    expect(orderLimit('500')).toBe(100)
    expect(orderLimit('0')).toBe(20)
  })
})
