import { create, isAxiosError, type AxiosInstance } from 'axios'

import { api } from '@/core/config/api'
import { demoAdapter } from '@/core/demo/demo-adapter'
import { demoMode } from '@/core/demo/demo-mode'
import { sessionActions } from '@/core/session/session-store'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'
import { logger } from '@/lib/logger'

import { toAppException } from './failure'

/**
 * Service бүрт нэг client. Base URL нь `core/config/api.ts`-аас — энд URL
 * бичихгүй.
 *
 * Бүгд ижил interceptor хуваалцана:
 * 1. `Authorization: Bearer <idToken>` (§1.2 — accessToken **биш**)
 * 2. 401 → session цэвэрлэх, login руу
 * 3. Алдааг `AppException` болгох
 */

const TIMEOUT_MS = 30_000

/**
 * Эдгээр endpoint 401 буцаахад logout хийхгүй — нэвтрэлтийн явцад 401 нь
 * "буруу код" гэсэн үг, "session дууссан" биш. Вэб админы
 * `AUTH_URL_SKIP_LOGOUT`-ийн яг хуулбар.
 */
const AUTH_URL_SKIP_LOGOUT = [
  '/auth/login',
  '/auth/mfa-challenge',
  '/auth/action-mfa/verify',
]

/**
 * Логт зөвхөн хаяг, статус — header, body, token **хэзээ ч биш** (§1.4).
 * `logger` нь release build дээр чимээгүй.
 */
function fullUrl(config: { baseURL?: string; url?: string }): string {
  return `${config.baseURL ?? ''}${config.url ?? ''}`
}

function attachInterceptors(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.request.use(async (config) => {
    // Демо горимд хүсэлт сүлжээ рүү гарахгүй, token ч хавсрахгүй.
    if (demoMode.isActive()) {
      config.adapter = demoAdapter
      return config
    }

    const token = await cognitoAuth.idToken()
    if (token) config.headers.Authorization = `Bearer ${token}`

    logger.debug('→', config.method?.toUpperCase(), fullUrl(config))

    // FormData-д boundary-г axios өөрөө тавина — гараар тавьсан
    // Content-Type түүнийг эвдэнэ.
    if (config.data instanceof FormData) delete config.headers['Content-Type']

    return config
  })

  instance.interceptors.response.use(
    (response) => {
      logger.debug(
        '←',
        response.status,
        response.config.method?.toUpperCase(),
        fullUrl(response.config),
      )
      return response
    },
    async (error: unknown) => {
      const failure = toAppException(error)

      logger.warn(
        '×',
        isAxiosError(error) ? (error.response?.status ?? 'сүлжээ') : '—',
        isAxiosError(error) ? fullUrl(error.config ?? {}) : '',
        failure.kind,
        failure.debugMessage,
      )

      if (isAxiosError(error) && error.response?.status === 401) {
        const url = error.config?.url ?? ''
        const skip = AUTH_URL_SKIP_LOGOUT.some((path) => url.includes(path))
        if (!skip) {
          logger.warn('401 ирлээ — session цэвэрлэж байна', url)
          await sessionActions.signOut()
        }
      }

      return Promise.reject(failure)
    },
  )

  return instance
}

function createClient(baseURL: string): AxiosInstance {
  return attachInterceptors(
    create({
      baseURL,
      timeout: TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

/**
 * Client-ууд анх хэрэглэгдэх үедээ л үүснэ (`env` нь import үед унших
 * ёсгүй). `clients.finance` гэж бичихэд тухайн нэг нь үүснэ.
 */
const cache = new Map<string, AxiosInstance>()

function client(name: keyof typeof api): AxiosInstance {
  const baseURL = api[name] as string
  let instance = cache.get(baseURL)
  if (!instance) {
    instance = createClient(baseURL)
    cache.set(baseURL, instance)
  }
  return instance
}

export const clients = {
  /** Хуучин backoffice — auth, support ticket, users, banks, convert, buynow. */
  get backoffice() {
    return client('backoffice')
  },
  /** Finance — futures transfer, retry, push notification, order-mnt/usdt. */
  get finance() {
    return client('finance')
  },
  get security() {
    return client('security')
  },
  get compliance() {
    return client('compliance')
  },
  /** Content — mobile banner, app version. */
  get content() {
    return client('content')
  },
  /** Stake — `staking/v3`, жагсаалт нь DynamoDB cursor-той. */
  get staking() {
    return client('staking')
  },
  /** Take-action асуумж — `account/v3/admin/accounts`. */
  get takeAction() {
    return client('takeAction')
  },
  /** Support monorepo service — conversation, upload-url. */
  get support() {
    return client('support')
  },
  /** WebSocket token олгогч (`/ws/token`). */
  get socket() {
    return client('socket')
  },
  get admin() {
    return client('admin')
  },
  get wallet() {
    return client('wallet')
  },
  /** Bank withdraw v2 — өөр origin дээр (`{origin}/v2/withdraw`). */
  get bankV2() {
    return client('bankV2')
  },
}
