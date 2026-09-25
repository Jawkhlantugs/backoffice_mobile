import type { AppException } from './errors/app-exception'

/**
 * Давхаргын хил давдаг, бүтэлгүйтэж болох бүхний буцаах төрөл.
 *
 * Шидэхийн оронд `Result` буцаадаг тул дуудагч алдааны замыг мартаж чадахгүй
 * — `ok`-ыг шалгах хүртэл `value` рүү хандах боломжгүй гэдгийг TypeScript
 * хангана.
 *
 * ⚠️ Програмчлалын алдаа (эвдэрсэн invariant, буруу cast) нь Result **биш** —
 * тэдгээрийг шид.
 */
export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: AppException }

export const Ok = <T>(value: T): Result<T> => ({ ok: true, value })

export const Err = <T = never>(error: AppException): Result<T> => ({
  ok: false,
  error,
})

/** Амжилтын утгыг хувиргана, алдааг хөндөхгүй. Repository-д DTO → model. */
export function mapResult<T, R>(
  result: Result<T>,
  transform: (value: T) => R,
): Result<R> {
  return result.ok ? Ok(transform(result.value)) : result
}

/** Хоёр салааг нэг утга болгож нийлүүлнэ. */
export function foldResult<T, R>(
  result: Result<T>,
  onOk: (value: T) => R,
  onErr: (error: AppException) => R,
): R {
  return result.ok ? onOk(result.value) : onErr(result.error)
}

/**
 * Алдаа гарвал `null`. Зөвхөн үнэхээр fallback-тай газарт — `ok` шалгахаас
 * зугтахын тулд үүнийг ашиглах нь Result-ийн утгыг үгүй хийнэ.
 */
export function valueOrNull<T>(result: Result<T>): T | null {
  return result.ok ? result.value : null
}
