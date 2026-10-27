import {
  amountFilterToApi,
  COIN_AMOUNT_CURRENCY,
  isValidAmountFilter,
} from '../amount-filter'

describe('amountFilterToApi', () => {
  it('MNT дүнг тоо болгоно', () => {
    expect(amountFilterToApi('6542550')).toBe(6542550)
    expect(amountFilterToApi(' 1200.50 ')).toBe(1200.5)
  })

  it('хоосон, буруу, илүү оронтой оролтыг явуулахгүй', () => {
    expect(amountFilterToApi(undefined)).toBeUndefined()
    expect(amountFilterToApi('')).toBeUndefined()
    expect(amountFilterToApi('12a')).toBeUndefined()
    expect(amountFilterToApi('1.234')).toBeUndefined()
  })
})

describe('isValidAmountFilter', () => {
  it('MNT-ийн 2 орноос илүүг татгалзана', () => {
    expect(isValidAmountFilter('100.25')).toBe(true)
    expect(isValidAmountFilter('100.255')).toBe(false)
    expect(isValidAmountFilter('abc')).toBe(false)
  })
})

describe('валютаар', () => {
  it('USDT нь 8 орон хүртэл', () => {
    expect(amountFilterToApi('12.12345678', 'USDT')).toBe(12.12345678)
    expect(amountFilterToApi('12.123456789', 'USDT')).toBeUndefined()
  })

  it('coin-ы дүн 18 орон хүртэл', () => {
    expect(
      isValidAmountFilter('0.000000000000000001', COIN_AMOUNT_CURRENCY),
    ).toBe(true)
    expect(amountFilterToApi('0.045954', COIN_AMOUNT_CURRENCY)).toBe(0.045954)
  })
})
