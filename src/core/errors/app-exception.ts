/**
 * Давхаргын хил давдаг бүх алдаа эдгээрийн нэг нь байна.
 *
 * `kind`-аар ялгасан discriminated union — `switch` нь бүрэн шалгагдана тул
 * шинэ төрөл нэмэхэд хэрэглэгч юу харахыг шийдэх ёстой газар бүрийг
 * TypeScript зааж өгнө.
 *
 * `debugMessage` нь лог руу. Хэрэглэгчид харагдах текст нь presentation
 * давхаргад (`lib/messages/`) үүснэ — ингэснээр орчуулагдана.
 *
 * Ганц үл хамаарах зүйл: `api`-ийн `message` нь серверийн татгалзсан шалтгаан
 * бөгөөд `translateError`-оор дамжиж хэрэглэгчид хүрч болно — "хүсэлт
 * амжилтгүй" гэдгээс жинхэнэ шалтгаан нь хамаагүй дээр.
 */
export type AppException =
  | NetworkError
  | ApiError
  | ParseError
  | AuthError
  | ValidationError
  | UnknownError

/** Хүсэлт сервер хүрээгүй, эсвэл буцаж ирээгүй. */
export type NetworkError = {
  kind: 'network'
  reason: 'offline' | 'timeout'
  debugMessage: string
}

/** Сервер хариулсан, гэхдээ хүссэн зүйлээр биш. */
export type ApiError = {
  kind: 'api'
  statusCode: number
  /** Envelope-ийн машин уншдаг код (`code`), байвал. Message-ээс илүүд үз. */
  code?: number
  /** Серверийн өөрийн тайлбар (`msg` / `message`). */
  message?: string
  debugMessage: string
}

/** Өгөгдөл ирсэн ч гэрээтэй таарахгүй. */
export type ParseError = { kind: 'parse'; debugMessage: string }

/** Session алга эсвэл хүчингүй. Апп login руу шилжих ёстой. */
export type AuthError = {
  kind: 'auth'
  reason:
    | 'expired'
    | 'invalidCredentials'
    | 'forbidden'
    | 'invalidCode'
    | 'codeExpired'
    | 'notConfirmed'
    | 'tooManyAttempts'
    | 'weakPassword'
  debugMessage: string
}

/** Клиент өөрөө татгалзаж чадах байсан оролт, серверээс мэдэгдсэн. */
export type ValidationError = {
  kind: 'validation'
  /** Формын аль талбарыг тодруулахыг заана. */
  field?: string
  debugMessage: string
}

/** Хэн ч төлөвлөөгүй зүйл. */
export type UnknownError = {
  kind: 'unknown'
  cause: unknown
  debugMessage: string
}

export const AppErrors = {
  offline: (): NetworkError => ({
    kind: 'network',
    reason: 'offline',
    debugMessage: 'no connectivity',
  }),
  timeout: (): NetworkError => ({
    kind: 'network',
    reason: 'timeout',
    debugMessage: 'request timed out',
  }),
  api: (
    statusCode: number,
    debugMessage: string,
    extra?: { code?: number; message?: string },
  ): ApiError => ({ kind: 'api', statusCode, debugMessage, ...extra }),
  parse: (debugMessage: string): ParseError => ({
    kind: 'parse',
    debugMessage,
  }),
  auth: (
    reason: AuthError['reason'],
    debugMessage: string = reason,
  ): AuthError => ({
    kind: 'auth',
    reason,
    debugMessage,
  }),
  validation: (debugMessage: string, field?: string): ValidationError => ({
    kind: 'validation',
    field,
    debugMessage,
  }),
  unknown: (cause: unknown): UnknownError => ({
    kind: 'unknown',
    cause,
    debugMessage: 'unhandled error',
  }),
}

/** `catch (e)` доторх `unknown`-ыг AppException болгоно. */
export function isAppException(value: unknown): value is AppException {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    'debugMessage' in value
  )
}
