import * as Crypto from 'expo-crypto'

export const IDEMPOTENCY_HEADER = 'x-idempotency-key'

/**
 * Мөнгө хөдөлгөх mutation бүрт давтагдашгүй түлхүүр.
 *
 * Вэб админ futures transfer-т үүнийг явуулдаг (`mutationConfig()`). Утас дээр
 * дахин оролдлого илүү түгээмэл (сүлжээ тасрах, хэрэглэгч дахин дарах) тул
 * энэ нь заавал — ижил түлхүүртэй хоёр хүсэлт нэг л гүйлгээ болно.
 */
export function idempotencyHeaders(key = Crypto.randomUUID()) {
  return { [IDEMPOTENCY_HEADER]: key }
}
