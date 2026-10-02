import { groupDigits } from '../group-digits'

describe('groupDigits', () => {
  it('мянгатаар бүлэглэнэ, бутархайг хөндөхгүй', () => {
    expect(groupDigits('35000000')).toBe('35,000,000')
    expect(groupDigits(1000)).toBe('1,000')
    expect(groupDigits('-1234.5678')).toBe('-1,234.5678')
    expect(groupDigits('999')).toBe('999')
  })

  it('тоо биш, хоосон утга', () => {
    expect(groupDigits('abc')).toBe('abc')
    expect(groupDigits('')).toBe('—')
    expect(groupDigits(undefined)).toBe('—')
  })
})
