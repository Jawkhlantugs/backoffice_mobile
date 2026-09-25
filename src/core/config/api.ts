import { env } from './env'

/**
 * Endpoint-ийн төв бүртгэл. xmeta-admin вэбийн `src/config/api.ts`-ийн яг
 * хуулбар — service бүрийн path prefix нь `.env`-д биш энд амьдарна.
 *
 * Хэрэглээ:
 *   import { api, joinUrl } from '@/core/config/api'
 *   backoffice.post(joinUrl(api.support, '/tickets/list'), body)
 */
export function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

/**
 * `new URL(...).origin`-ийн орлуулга. RN-ийн URL polyfill бүрэн биш тул
 * origin-ыг найдвартай өгдөггүй — regex нь энд илүү найдвартай.
 */
function originOf(url: string): string {
  const origin = /^(https?:\/\/[^/?#]+)/.exec(url)?.[1]
  if (!origin) throw new Error(`URL биш утга: ${url}`)
  return origin
}

function buildApi() {
  const BASE = env.xmetaApiUrl
  const ORIGIN = originOf(BASE)
  const BACKOFFICE = env.backofficeApiUrl

  return {
    base: BASE,

    // Хуучин backoffice (өөр host)
    backoffice: BACKOFFICE,

    // Monorepo gateway дээрх service бүрийн path prefix
    admin: `${BASE}/admin/v3/admin`,
    content: `${BASE}/backoffice/content/v3/admin`,
    compliance: `${BASE}/backoffice/compliance/v3/admin`,
    finance: `${BASE}/backoffice/finance/v3/admin`,
    security: `${BASE}/backoffice/security/v3/admin`,
    userSecurity: `${BASE}/security/v3/admin/user/security`,
    staking: `${BASE}/staking/v3`,
    takeAction: `${BASE}/account/v3/admin/accounts`,
    support: `${BASE}/support/support-ticket/`,
    socket: `${BASE}/socket/v3/admin`,
    wallet: `${BASE}/wallet/v3/admin/wallets`,
    bankV2: `${ORIGIN}/v2/withdraw`,

    ws: env.supportWsUrl,
  } as const
}

let cached: ReturnType<typeof buildApi> | null = null

/** Анх дуудагдахад л `env`-ийг уншина — import үед унахгүй. */
export function apiConfig(): ReturnType<typeof buildApi> {
  cached ??= buildApi()
  return cached
}

/** Proxy — `api.finance` гэж бичихэд л env уншигдана. */
export const api = new Proxy({} as ReturnType<typeof buildApi>, {
  get: (_target, prop: string) =>
    apiConfig()[prop as keyof ReturnType<typeof buildApi>],
})
