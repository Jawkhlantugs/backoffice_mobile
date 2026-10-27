import { moneyToApiNumber } from '@/core/money/format'
import { tryParseMoney } from '@/core/money/money'

/** Вэбийн шүүлтүүрийн `condition` — дүнг тэнцүү / их / багаар харьцуулна. */
export const AMOUNT_CONDITIONS = ['EQUAL', 'GREATER_THAN', 'LESS_THAN'] as const
export type AmountCondition = (typeof AMOUNT_CONDITIONS)[number]

/** Банкны гүйлгээ, зарлага бүгд MNT. */
const BANK_CURRENCY = 'MNT'

/**
 * Crypto жагсаалтын "Amount" нь coin бүрийн өөрийн нэгжээр (BCH, DOGE…) —
 * ихэнх нь `CURRENCIES`-д байхгүй. Босго утга тул аппын хамгийн өргөн
 * нарийвчлалаар (ETH, 18 орон) шалгана.
 */
export const COIN_AMOUNT_CURRENCY = 'ETH'

export const isValidAmountFilter = (raw: string, currency = BANK_CURRENCY) =>
  tryParseMoney(raw, currency) !== null

/** Вэб шиг JSON тоогоор илгээнэ (§10.7). Буруу оролтыг явуулахгүй. */
export function amountFilterToApi(
  raw: string | undefined,
  currency = BANK_CURRENCY,
): number | undefined {
  if (!raw) return undefined
  const money = tryParseMoney(raw, currency)
  return money ? moneyToApiNumber(money) : undefined
}
