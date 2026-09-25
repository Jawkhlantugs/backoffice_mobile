import { currencyOf, tryCurrencyOf, type Currency } from './currency'

/**
 * Нэг валютын яг таг дүн.
 *
 * Мөнгийг валютын хамгийн жижиг нэгжийн бүхэл тоогоор барина — 12.34 MNT нь
 * `1234n`. `number` балансыг нэмэх бүрд хазайдаг, бүхэл тоо хэзээ ч
 * хазайдаггүй.
 *
 * ⚠️ **`bigint` ашигласан шалтгаан:** JS-ийн `number` нь 2⁵³ хүртэл л бүхэл
 * тоог яг барина. USDT 8 оронтой тул `Number.MAX_SAFE_INTEGER` нь ердөө ~90
 * сая USDT — master account-ийн баланс түүнээс давж болно. `bigint` дээд
 * хязгааргүй.
 *
 * **`number`-оос Money үүсгэх арга зориуд байхгүй.** Дүн нь API-аас string
 * эсвэл number хэлбэрээр орж ирж (`parseMoney`), string болж гарна.
 */
export type Money = {
  readonly minorUnits: bigint
  readonly currency: Currency
}

export type Rounding = 'down' | 'up' | 'halfUp'

const DECIMAL = /^([+-])?(\d+)(?:\.(\d+))?$/

export function zeroMoney(code: string): Money {
  return { minorUnits: 0n, currency: currencyOf(code) }
}

/**
 * Backend дүнг string эсвэл number-аар буцааж болно — хоёуланг нь задална.
 *
 * ⚠️ `number` ирсэн тохиолдолд нарийвчлал аль хэдийн алдагдсан байж болно
 * (JSON.parse нь `0.1` гэснийг хамгийн ойрын double болгодог). Тоог дахин
 * string болгож задлах нь тэр double-ийн хамгийн богино төлөөллийг авна —
 * серверийн бичсэн цифрүүдтэй практикт таардаг.
 */
export function parseMoney(raw: string | number, code: string): Money {
  const money = tryParseMoney(raw, code)
  if (!money) throw new Error(`${code}-ийн дүн биш: ${raw}`)
  return money
}

/** Хэрэглэгчийн хагас бичсэн оролтод шидэлтгүй хувилбар. */
export function tryParseMoney(
  raw: string | number,
  code: string,
): Money | null {
  const currency = tryCurrencyOf(code)
  if (!currency) return null
  const text = typeof raw === 'number' ? String(raw) : raw.trim()

  const match = DECIMAL.exec(text)
  if (!match) return null

  const fraction = match[3] ?? ''
  // Валютаас илүү орон ирэх нь гэрээний зөрчил. Чимээгүй тайрах нь мөнгө
  // алдагдах зам тул татгалзана.
  if (fraction.length > currency.decimals) return null

  const digits = match[2] + fraction.padEnd(currency.decimals, '0')
  const units = BigInt(digits)

  return { minorUnits: match[1] === '-' ? -units : units, currency }
}

function sameCurrency(a: Money, b: Money, operation: string): void {
  if (a.currency.code !== b.currency.code) {
    throw new Error(
      `${a.currency.code} ба ${b.currency.code}-г ${operation} боломжгүй`,
    )
  }
}

export function addMoney(a: Money, b: Money): Money {
  sameCurrency(a, b, 'нэмэх')
  return { minorUnits: a.minorUnits + b.minorUnits, currency: a.currency }
}

export function subtractMoney(a: Money, b: Money): Money {
  sameCurrency(a, b, 'хасах')
  return { minorUnits: a.minorUnits - b.minorUnits, currency: a.currency }
}

export function compareMoney(a: Money, b: Money): number {
  sameCurrency(a, b, 'харьцуулах')
  if (a.minorUnits === b.minorUnits) return 0
  return a.minorUnits < b.minorUnits ? -1 : 1
}

export const isZeroMoney = (m: Money) => m.minorUnits === 0n
export const isNegativeMoney = (m: Money) => m.minorUnits < 0n

/**
 * `numerator/denominator` бутархайгаар үржүүлнэ. 0.25% шимтгэл гэвэл
 * `scaleMoney(amount, 25n, 10000n, 'up')`.
 *
 * `number` коэффициент биш харьцаагаар барьсан нь тооцоог дуудагчийн хүссэн
 * ганц бөөрөнхийлөх алхам хүртэл яг таг байлгана.
 */
export function scaleMoney(
  money: Money,
  numerator: bigint,
  denominator: bigint,
  rounding: Rounding,
): Money {
  if (denominator <= 0n) throw new Error('denominator эерэг байх ёстой')

  const product = money.minorUnits * numerator
  const quotient = product / denominator
  const remainder = product % denominator
  if (remainder === 0n)
    return { minorUnits: quotient, currency: money.currency }

  const away = product < 0n ? quotient - 1n : quotient + 1n
  const abs = remainder < 0n ? -remainder : remainder
  const rounded =
    rounding === 'down'
      ? quotient
      : rounding === 'up'
        ? away
        : abs * 2n >= denominator
          ? away
          : quotient

  return { minorUnits: rounded, currency: money.currency }
}
