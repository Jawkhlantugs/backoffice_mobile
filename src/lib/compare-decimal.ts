const DECIMAL = /^([+-])?([\d,]+)(?:\.(\d+))?$/

type Parsed = { negative: boolean; whole: string; fraction: string }

function parse(raw: string): Parsed | null {
  const match = DECIMAL.exec(raw.trim())
  if (!match) return null
  const whole = (match[2] ?? '').replace(/,/g, '').replace(/^0+/, '')
  const fraction = (match[3] ?? '').replace(/0+$/, '')
  const zero = whole === '' && fraction === ''
  return { negative: match[1] === '-' && !zero, whole, fraction }
}

function compareMagnitude(a: Parsed, b: Parsed): number {
  if (a.whole.length !== b.whole.length) return a.whole.length - b.whole.length
  if (a.whole !== b.whole) return a.whole < b.whole ? -1 : 1
  const width = Math.max(a.fraction.length, b.fraction.length)
  const left = a.fraction.padEnd(width, '0')
  const right = b.fraction.padEnd(width, '0')
  if (left === right) return 0
  return left < right ? -1 : 1
}

/**
 * Аравтын бутархай хоёр мөрийг `number` болгохгүйгээр харьцуулна (§10) —
 * `"0.30000001"` ба `"0.3"` ялгаатай хэвээр. Аль нэг нь тоо биш бол `null`.
 */
export function compareDecimal(a: string, b: string): number | null {
  const left = parse(a)
  const right = parse(b)
  if (!left || !right) return null
  if (left.negative !== right.negative) return left.negative ? -1 : 1
  const magnitude = compareMagnitude(left, right)
  return left.negative ? -magnitude : magnitude
}
