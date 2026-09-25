import { isAxiosError } from 'axios'

import {
  AppErrors,
  isAppException,
  type AppException,
} from '@/core/errors/app-exception'

/**
 * Axios-ийн алдааг `AppException` болгоно. Сүлжээний давхаргаас гарах ганц
 * алдааны төрөл энэ — дээд давхаргууд axios-ыг мэдэхгүй.
 */
export function toAppException(error: unknown): AppException {
  if (isAppException(error)) return error

  if (!isAxiosError(error)) return AppErrors.unknown(error)

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return AppErrors.timeout()
  }

  const response = error.response
  if (!response) return AppErrors.offline()

  const body = response.data as
    { msg?: string; message?: string; code?: number } | undefined
  // Вэб админ яг энэ дарааллаар уншдаг (`shared/client.ts`).
  const message = body?.msg ?? body?.message

  if (response.status === 401)
    return AppErrors.auth('expired', message ?? '401')
  if (response.status === 403) {
    return AppErrors.auth('forbidden', message ?? '403')
  }
  if (response.status === 422 || response.status === 400) {
    return AppErrors.validation(message ?? `HTTP ${response.status}`)
  }

  return AppErrors.api(response.status, message ?? `HTTP ${response.status}`, {
    code: body?.code,
    message,
  })
}
