import { AppErrors } from '@/core/errors/app-exception'

/**
 * Backend-ийн хариу service бүрт өөр хэлбэртэй. Вэб админаас батлагдсан 4
 * хэлбэр:
 *
 * | Хэлбэр                   | Хаана                                  |
 * |--------------------------|----------------------------------------|
 * | `{ message, body }`      | backoffice (`BaseResponse<T>`)         |
 * | `{ code, message, data }`| finance action-ууд                     |
 * | `{ msg, data }`          | futures transfer, ws token             |
 * | дугтуйгүй, шууд өгөгдөл  | зарим GET                              |
 *
 * `unwrap` бүгдийг нэг болгоно. Controller, дэлгэц түүхий хэлбэрийг хэзээ ч
 * харахгүй (§8).
 */
export type RawEnvelope<T> = {
  code?: number
  msg?: string
  message?: string
  data?: T
  body?: T
}

/** Envelope-ийн машин уншдаг амжилтын код. */
const SUCCESS_CODE = 0

/**
 * Дугтуйг задалж өгөгдлийг гаргана.
 *
 * `code` байгаад 0 биш бол сервер татгалзсан гэсэн үг — HTTP 200 байсан ч.
 * Вэб админ яг ийм шалгалт хийдэг (`order-mnt.service.ts`).
 */
export function unwrap<T>(payload: T | RawEnvelope<T>): T {
  const wrapped = payload as RawEnvelope<T>

  if (wrapped?.code !== undefined && wrapped.code !== SUCCESS_CODE) {
    throw AppErrors.api(200, `envelope code ${wrapped.code}`, {
      code: wrapped.code,
      message: wrapped.msg ?? wrapped.message,
    })
  }

  if (wrapped?.data !== undefined) return wrapped.data
  if (wrapped?.body !== undefined) return wrapped.body
  return payload as T
}

/**
 * Дугтуйгаа задлаад объект гэдгийг нь батална.
 *
 * Чангаар унах нь зорилго: гэрээ зөрчигдсөнийг default утгаар нуувал буруу
 * баланс дэлгэцэн дээр гарна, алдааны мессеж гарахгүй.
 */
export function unwrapObject<T extends object>(
  payload: unknown,
  what: string,
): T {
  const value = unwrap(payload as RawEnvelope<T>)
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw AppErrors.parse(`\`${what}\` объект хүлээсэн, ирсэн: ${typeof value}`)
  }
  return value as T
}

/**
 * Жагсаалтын хариунууд нэгдсэн хэлбэргүй: `items`, `list`, эсвэл шууд массив.
 * Support service гурвуулангаар нь буцаадаг.
 */
/** Вэбийн `useFilterParams`-тай ижил хуудасны параметр. */
export type PageParams = { current: number; pageSize: number; query?: string }

/** DynamoDB cursor-той жагсаалт — cursor нь JSON string (repository задална). */
export type CursorParams = { limit: number; cursor?: string; query?: string }

export type ListPage<T> = {
  items: T[]
  /** Нийт тоо — offset pagination-д. Cursor хэлбэрт байхгүй. */
  total?: number
  /** DynamoDB cursor — дараагийн хуудсыг үүгээр авна. */
  lastEvaluatedKey?: string
}

export function unwrapList<T>(payload: unknown, what: string): ListPage<T> {
  const value = unwrap(payload as RawEnvelope<unknown>)

  if (Array.isArray(value)) return { items: value as T[] }

  if (typeof value !== 'object' || value === null) {
    throw AppErrors.parse(
      `\`${what}\` жагсаалт хүлээсэн, ирсэн: ${typeof value}`,
    )
  }

  const bag = value as Record<string, unknown>
  const items = bag.items ?? bag.list ?? bag.records

  if (!Array.isArray(items)) {
    throw AppErrors.parse(
      `\`${what}\`-д items/list массив олдсонгүй. Түлхүүрүүд: ${Object.keys(bag).join(', ')}`,
    )
  }

  return {
    items: items as T[],
    total: typeof bag.total === 'number' ? bag.total : undefined,
    lastEvaluatedKey:
      typeof bag.lastEvaluatedKey === 'string'
        ? bag.lastEvaluatedKey
        : undefined,
  }
}
