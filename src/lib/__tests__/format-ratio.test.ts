import { formatRatio } from '../format-ratio'

describe('formatRatio', () => {
  it('харьцааг хувь болгоно, float хог гаргахгүй', () => {
    expect(formatRatio(0.07)).toBe('7%')
    expect(formatRatio(0.0025)).toBe('0.25%')
    expect(formatRatio('0.15')).toBe('15%')
    expect(formatRatio(1)).toBe('100%')
  })

  it('сөрөг ба бутархай олон оронтой утга', () => {
    expect(formatRatio(-0.123456)).toBe('-12.3456%')
    expect(formatRatio(0)).toBe('0%')
  })

  it('хоосон утгад зураас', () => {
    expect(formatRatio(undefined)).toBe('—')
    expect(formatRatio(null)).toBe('—')
  })
})
