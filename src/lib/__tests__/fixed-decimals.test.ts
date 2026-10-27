import { fixedDecimals, stepDecimals } from '../fixed-decimals'

describe('fixedDecimals', () => {
  it('доош тайрч, мянгатыг таслана', () => {
    expect(fixedDecimals('1.0528263269639064', 4)).toBe('1.0528')
    expect(fixedDecimals('2309.88116279', 2)).toBe('2,309.88')
  })

  it('дутуу оронг тэгээр нөхнө', () => {
    expect(fixedDecimals('0.9065', 6)).toBe('0.906500')
    expect(fixedDecimals(27000, 2)).toBe('27,000.00')
  })

  it('сөрөг тэгийг "-" тэмдэггүй болгоно', () => {
    expect(fixedDecimals('-0.001', 2)).toBe('0.00')
    expect(fixedDecimals('-12.345', 2)).toBe('-12.34')
  })

  it('e-бичиглэл ба тоо бишийг зохицуулна', () => {
    expect(fixedDecimals(1e-8, 2)).toBe('0.00')
    expect(fixedDecimals('abc', 2)).toBe('abc')
    expect(fixedDecimals(undefined, 2)).toBe('—')
  })
})

describe('stepDecimals', () => {
  it('tick size-аас орон', () => {
    expect(stepDecimals('0.00010')).toBe(4)
    expect(stepDecimals('1')).toBe(0)
    expect(stepDecimals(undefined)).toBeUndefined()
  })
})
