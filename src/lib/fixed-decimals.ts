import { groupDigits } from './group-digits'
import { plainDecimal } from './plain-decimal'

/**
 * Үнэ, тоо хэмжээг яг `decimals` оронтой: доош тайрч, дутуу бол тэгээр
 * нөхнө, мянгатыг таслана. `number` болгохгүй — мөрөөр. Тоо биш бол хэвээр.
 */
export function fixedDecimals(
  raw: string | number | undefined,
  decimals: number,
): string {
  if (raw === undefined || raw === '') return '—'
  const text = plainDecimal(raw)
  const match = /^(-?)(\d+)(?:\.(\d*))?$/.exec(text)
  if (!match) return text
  const [, sign = '', whole = '', fraction = ''] = match
  const cut = fraction.slice(0, decimals).padEnd(decimals, '0')
  const isZero = /^0+$/.test(whole) && /^0*$/.test(cut)
  return `${isZero ? '' : sign}${groupDigits(whole)}${decimals > 0 ? `.${cut}` : ''}`
}

/** Binance-ийн `priceTickSize` (`0.00010`) → орон (4). */
export function stepDecimals(step: string | undefined): number | undefined {
  if (!step) return undefined
  const trimmed = step.replace(/0+$/, '').replace(/\.$/, '')
  const dot = trimmed.indexOf('.')
  return dot === -1 ? 0 : trimmed.length - dot - 1
}
