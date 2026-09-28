import { isAppException, type AppException } from '@/core/errors/app-exception'

import { en } from './en'
import { useLanguageStore } from './language-store'
import { mn, type Messages } from './mn'

export { useLanguageStore, type Language } from './language-store'
export type { Messages } from './mn'

/**
 * Хэрэглэгчид харагдах бүх текст `mn.ts` / `en.ts`-д. Дэлгэц, компонент
 * дотор өгүүлбэр шууд бичихгүй.
 */
const DICTIONARIES = { en, mn } as const

function resolve(path: readonly string[]): unknown {
  let node: unknown = DICTIONARIES[useLanguageStore.getState().language]
  for (const key of path) {
    node = (node as Record<string, unknown> | undefined)?.[key]
  }
  return node
}

const views = new Map<string, object>()

/**
 * Модулийн түвшинд `const f = messages.finance.fields` гэж барьсан ч текст нь
 * уншигдах мөчид идэвхтэй хэлээр гарна — string биш, зам барьж байгаа тул.
 */
function view(path: readonly string[]): object {
  const id = path.join('.')
  const cached = views.get(id)
  if (cached) return cached

  const created = new Proxy(
    {},
    {
      get(_target, key) {
        if (typeof key !== 'string') return undefined
        const value = resolve([...path, key])
        return typeof value === 'object' && value !== null
          ? view([...path, key])
          : value
      },
      has: (_target, key) => key in (resolve(path) as object),
      ownKeys: () => Reflect.ownKeys(resolve(path) as object),
      getOwnPropertyDescriptor(_target, key) {
        const descriptor = Reflect.getOwnPropertyDescriptor(
          resolve(path) as object,
          key,
        )
        return descriptor && { ...descriptor, configurable: true }
      },
    },
  )
  views.set(id, created)
  return created
}

export const messages = view([]) as Messages

/**
 * `AppException` → хэрэглэгчийн өгүүлбэр.
 *
 * `api` төрөлд серверийн `message`-ийг шууд дамжуулна: backend админд
 * зориулж бичсэн тайлбар нь ("Insufficient balance") "Алдаа гарлаа"
 * гэдгээс хамаагүй ашигтай.
 */
export function translateError(error: AppException): string {
  switch (error.kind) {
    case 'network':
      return error.reason === 'offline'
        ? messages.errors.offline
        : messages.errors.timeout
    case 'auth':
      return messages.errors[error.reason]
    case 'validation':
      return error.debugMessage || messages.errors.unknown
    case 'api':
      return error.message ?? messages.errors.unknown
    case 'parse':
      return messages.errors.parse
    case 'unknown':
      return messages.errors.unknown
  }
}

/**
 * TanStack Query нь алдааг `Error` гэж төрөлжүүлдэг тул дуудагч бүр cast
 * хийхээс сэргийлж энд нэг л газар шалгана.
 */
export function translateUnknownError(error: unknown): string {
  return isAppException(error) ? translateError(error) : messages.errors.unknown
}
