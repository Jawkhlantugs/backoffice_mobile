/**
 * Лог. Release build дээр чимээгүй — админ аппын лог дээр хэрэглэгчийн
 * мэдээлэл, token тохиолдох эрсдэлтэй (§1.4).
 */
const enabled = __DEV__

export const logger = {
  debug: (...args: unknown[]) => enabled && console.log('[debug]', ...args),
  warn: (...args: unknown[]) => enabled && console.warn('[warn]', ...args),
  /** Алдаа release дээр ч харагдана — гэхдээ зөвхөн `debugMessage` түвшинд. */
  error: (...args: unknown[]) => console.error('[error]', ...args),
}
