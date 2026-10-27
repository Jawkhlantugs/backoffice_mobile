import type { AmountField } from '@/core/money/format'

import type { StatusTone } from './status-pill'

/**
 * Карт/дэлгэрэнгүйн нэг мөр. `value` хоосон (`undefined`, `null`, `''`) бол
 * харуулахгүй — дэлгэц бүр `? :` бичихгүй.
 */
export type RecordField = {
  label: string
  value?: string | number | null
  /** Мөнгөн дүн — `formatAmountSafe`-ээр (§10). `value`-ийн оронд. */
  amount?: AmountField
  /**
   * Өгвөл утгыг статусын pill-ээр (вэбийн Badge шиг) харуулна; `amount`-тай
   * бол pill-гүй өнгөт текст (вэбийн ногоон кредит, улаан дебит).
   */
  tone?: StatusTone
}

export function visibleFields(fields: readonly RecordField[]): RecordField[] {
  return fields.filter(
    (field) =>
      field.amount !== undefined ||
      (field.value !== undefined && field.value !== null && field.value !== ''),
  )
}
