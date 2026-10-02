/**
 * Аравтын цэгийг мөрөөр шилжүүлнэ: `places` эерэг бол ×10ⁿ, сөрөг бол
 * ÷10ⁿ. `0.07 * 100` шиг float хог, цент→доллар хуваалтын алдаа гарахгүй.
 * Тоо биш (`1e-7` г.м.) бол `null`.
 */
export function shiftDecimal(
  value: number | string,
  places: number,
): string | null {
  const match = /^(-?)(\d*)(?:\.(\d*))?$/.exec(String(value).trim())
  if (!match) return null
  const [, sign = '', whole = '', fraction = ''] = match
  if (whole === '' && fraction === '') return null

  const digits = `${whole}${fraction}`
  let point = whole.length + places
  let padded = digits
  if (point < 0) {
    padded = `${'0'.repeat(-point)}${digits}`
    point = 0
  } else if (point > digits.length) {
    padded = digits.padEnd(point, '0')
  }

  const integer = padded.slice(0, point).replace(/^0+(?=\d)/, '') || '0'
  const decimals = padded.slice(point).replace(/0+$/, '')
  const result = `${integer}${decimals ? `.${decimals}` : ''}`
  return result === '0' ? '0' : `${sign}${result}`
}
