import { shiftDecimal } from '../shift-decimal'

describe('shiftDecimal', () => {
  it('×100 — харьцаа → хувь, float хоггүй', () => {
    expect(shiftDecimal(0.07, 2)).toBe('7')
    expect(shiftDecimal('0.0025', 2)).toBe('0.25')
    expect(shiftDecimal(1, 2)).toBe('100')
  })

  it('÷100 — цент → доллар', () => {
    expect(shiftDecimal(123456, -2)).toBe('1234.56')
    expect(shiftDecimal(5, -2)).toBe('0.05')
    expect(shiftDecimal(-250, -2)).toBe('-2.5')
    expect(shiftDecimal(0, -2)).toBe('0')
  })

  it('тоо биш бол null', () => {
    expect(shiftDecimal('1e-7', 2)).toBeNull()
    expect(shiftDecimal('abc', 2)).toBeNull()
    expect(shiftDecimal('', 2)).toBeNull()
  })
})
