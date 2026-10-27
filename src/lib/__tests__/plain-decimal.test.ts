import { plainDecimal } from '../plain-decimal'

describe('plainDecimal', () => {
  it('сөрөг зэрэгтийг задална', () => {
    expect(plainDecimal(1e-8)).toBe('0.00000001')
    expect(plainDecimal(7.72062909e-7)).toBe('0.000000772062909')
    expect(plainDecimal('2.5e-13')).toBe('0.00000000000025')
    expect(plainDecimal(-3e-7)).toBe('-0.0000003')
  })

  it('эерэг зэрэгтийг задална', () => {
    expect(plainDecimal(1.5e21)).toBe('1500000000000000000000')
    expect(plainDecimal('1E+3')).toBe('1000')
  })

  it('энгийн тоо, тоо бишийг хэвээр үлдээнэ', () => {
    expect(plainDecimal(0.972)).toBe('0.972')
    expect(plainDecimal('abc')).toBe('abc')
  })
})
