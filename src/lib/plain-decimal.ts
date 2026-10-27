import { shiftDecimal } from './shift-decimal'

/**
 * JS `1e-8`, `7.7e-7` гэж бичдэг тоог энгийн бичиглэлд: `0.00000001`.
 * Backend бага дүнг JSON тоогоор буцаахад `String()` ийм хэлбэр гаргадаг.
 * Тоо биш бол хэвээр.
 */
export function plainDecimal(raw: string | number): string {
  const text = String(raw).trim()
  const match = /^(-?\d*\.?\d+)e([+-]?\d+)$/i.exec(text)
  if (!match) return text
  const [, mantissa = '', exponent = '0'] = match
  return shiftDecimal(mantissa, Number(exponent)) ?? text
}
