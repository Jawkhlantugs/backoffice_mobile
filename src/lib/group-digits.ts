/**
 * `35000000` → `35,000,000`. Валютгүй бүхэл дүнд (хязгаар, тоо ширхэг) —
 * `number` болгохгүй, мөрөөр бүлэглэнэ. Тоо биш бол хэвээр.
 */
export function groupDigits(raw: string | number | undefined): string {
  if (raw === undefined || raw === '') return '—'
  const text = String(raw)
  const match = /^(-?)(\d+)(\.\d+)?$/.exec(text)
  if (!match) return text
  const [, sign, whole = '', fraction = ''] = match
  return `${sign}${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${fraction}`
}
