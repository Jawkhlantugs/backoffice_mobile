import type { Money } from './money'
import { tryParseMoney } from './money'

/**
 * Дэлгэц дээрх бичиг. Вэб админы `formatMoney()` / `truncateFloor()`-тэй
 * ижил үр дүн өгөх ёстой — нэг дүн хоёр газар өөр харагдвал ажилтан алдаа
 * гэж бодно.
 *
 * Хадгалснаас цөөн орон гаргахад **доош тайрна** (бөөрөнхийлөхгүй):
 * хэрэглэгчид дансандаа байгаагаас илүү тоо хэзээ ч харагдахгүй.
 */
export function formatMoney(
  money: Money,
  options: {
    withSymbol?: boolean
    trimTrailingZeros?: boolean
    fractionDigits?: number
    groupSeparator?: string
    decimalSeparator?: string
  } = {},
): string {
  const {
    withSymbol = false,
    trimTrailingZeros = false,
    fractionDigits,
    groupSeparator = ',',
    decimalSeparator = '.',
  } = options

  const { currency, minorUnits } = money
  const shown = Math.min(
    Math.max(fractionDigits ?? currency.displayDecimals, 0),
    currency.decimals,
  )

  const negative = minorUnits < 0n
  const digits = (negative ? -minorUnits : minorUnits)
    .toString()
    .padStart(currency.decimals + 1, '0')

  const split = digits.length - currency.decimals
  const whole = digits.slice(0, split)
  let fraction = digits.slice(split, split + shown)
  if (trimTrailingZeros) fraction = fraction.replace(/0+$/, '')

  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)

  let out = ''
  if (negative) out += '-'
  if (withSymbol && currency.symbol) out += currency.symbol
  out += grouped
  if (fraction) out += decimalSeparator + fraction
  if (withSymbol && !currency.symbol) out += ` ${currency.code}`
  return out
}

/**
 * API-д буцаах хэлбэр: `"310557.20"`. Дэлгэцийнхээс ялгаатай нь бүтэн
 * нарийвчлалтай — сүлжээнд явах дүн хэзээ ч тайрагдахгүй.
 */
export function moneyToApiString(money: Money): string {
  return formatMoney(money, {
    groupSeparator: '',
    fractionDigits: money.currency.decimals,
  })
}

/**
 * Мөн дүн JSON **тоо** хэлбэрээр. Зарим endpoint үүнийг шаарддаг.
 *
 * **Мөнгө `number` болдог цорын ганц газар, зөвхөн сүлжээнд зориулагдсан.**
 * Үр дүнгээр нь юу ч тооцохгүй — шууд request body руу явна.
 */
export function moneyToApiNumber(money: Money): number {
  return Number(
    formatMoney(money, {
      groupSeparator: '',
      trimTrailingZeros: true,
      fractionDigits: money.currency.decimals,
    }),
  )
}

/**
 * Crypto жагсаалтууд (deposit/withdrawal) `CURRENCIES`-д бүртгэгдээгүй олон
 * coin буцаадаг — нарийвчлалыг нь таамаглах нь буруу дүн харуулах эрсдэлтэй
 * (§10). Танихгүй ticker дээр тооцоо хийхгүй, зөвхөн түүхий дүнг харуулна.
 */
export function formatAmountSafe(raw: string | number, code: string): string {
  const money = tryParseMoney(raw, code)
  if (money) return formatMoney(money, { trimTrailingZeros: true })
  return `${raw} ${code}`.trim()
}

/**
 * Finance жагсаалтын дүнгийн түүхий хэлбэр — `Money`-д шууд хөрвүүлдэггүй нь
 * зориудаар: валют нь `CURRENCIES`-д байхгүй байж болно (§10-ийн доорх
 * тайлбар), тооцоо хийхгүй, зөвхөн харуулна (`AmountText`, `formatAmountSafe`).
 */
export type AmountField = { raw: string | number; currency: string }
