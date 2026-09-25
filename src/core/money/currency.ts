/**
 * Аппын барьж чадах валютууд, тус бүрийн нарийвчлалын хамт.
 *
 * **Хоёр өөр нарийвчлал байна.** `decimals` нь бирж дансаа хөтөлдөг бодит
 * орон — дүн бүр тэр жижиг нэгжийн бүхэл тоогоор хадгалагдана.
 * `displayDecimals` нь дэлгэц дээр хэдийг харуулах вэ гэдэг.
 */
export type CurrencyCode = 'MNT' | 'USDT' | 'BTC' | 'ETH' | 'USD'

export type Currency = {
  code: CurrencyCode
  /** Дансны бодит нарийвчлал. Арифметик, сүлжээнд явах бичиг энүүгээр. */
  decimals: number
  /** Хэрэглэгчид харуулах бутархай орон. `decimals`-аас бага байж болно. */
  displayDecimals: number
  /** Цифрийн өмнө тавих тэмдэг. Байхгүй бол дүнгийн ард `code` бичигдэнэ. */
  symbol?: string
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  MNT: { code: 'MNT', decimals: 2, displayDecimals: 2, symbol: '₮' },
  USD: { code: 'USD', decimals: 2, displayDecimals: 2, symbol: '$' },
  /**
   * ⚠️ **8, 6 биш.** Хуулганы endpoint `9.02962042` шиг найман оронтой дүн
   * илгээдэг. Зургаагаар барьвал parse татгалзаж, түүх уншигдахгүй болно.
   */
  USDT: { code: 'USDT', decimals: 8, displayDecimals: 6 },
  BTC: { code: 'BTC', decimals: 8, displayDecimals: 8 },
  ETH: { code: 'ETH', decimals: 18, displayDecimals: 8 },
}

/** Танихгүй ticker дээр `null` — шидэлтгүй хувилбар (`tryParseMoney`-д). */
export function tryCurrencyOf(code: string): Currency | null {
  return CURRENCIES[code.trim().toUpperCase() as CurrencyCode] ?? null
}

/**
 * Танихгүй ticker дээр шидэнэ — гэрээний зөрчлийг чимээгүй default болгох нь
 * буруу дүн харуулах зам.
 */
export function currencyOf(code: string): Currency {
  const currency = tryCurrencyOf(code)
  if (!currency) throw new Error(`Танихгүй валют: ${code}`)
  return currency
}
