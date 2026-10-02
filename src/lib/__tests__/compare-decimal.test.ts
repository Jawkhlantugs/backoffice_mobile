import { compareDecimal } from '../compare-decimal'

describe('compareDecimal', () => {
  it('number-т алдагдах нарийвчлалыг ялгана', () => {
    expect(compareDecimal('0.30000001', '0.3')).toBeGreaterThan(0)
    expect(compareDecimal('9007199254740993', '9007199254740992')).toBe(1)
  })

  it('урт ба бутархайн орноор зөв эрэмбэлнэ', () => {
    expect(compareDecimal('10', '9.99')).toBeGreaterThan(0)
    expect(compareDecimal('1.5', '1.50')).toBe(0)
    expect(compareDecimal('001.2', '1.2')).toBe(0)
  })

  it('сөрөг тоог тэмдгээр нь харьцуулна, -0 нь 0', () => {
    expect(compareDecimal('-5', '3')).toBeLessThan(0)
    expect(compareDecimal('-5', '-3')).toBeLessThan(0)
    expect(compareDecimal('-0', '0')).toBe(0)
  })

  it('мянгатын таслалтай тоог уншина', () => {
    expect(compareDecimal('1,200.5', '999')).toBeGreaterThan(0)
  })

  it('тоо биш бол null', () => {
    expect(compareDecimal('abc', '1')).toBeNull()
    expect(compareDecimal('12 / 100', '1')).toBeNull()
    expect(compareDecimal('', '1')).toBeNull()
  })
})
