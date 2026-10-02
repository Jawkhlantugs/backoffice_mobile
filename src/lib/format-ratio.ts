import { shiftDecimal } from './shift-decimal'

/**
 * Харьцааг (0.0025) хувь (0.25%) болгоно — цэгийг мөрөөр шилжүүлдэг тул
 * float хог гарахгүй. Шимтгэлийн хувь, APR зэрэг харуулах утгад л (§10).
 */
export function formatRatio(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '—'
  const percent = shiftDecimal(value, 2)
  return `${percent ?? String(value)}%`
}
