import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { apiConfig } from '@/core/config/api'

import { handleDemoRequest } from './demo-backend'

/** Хүсэлтийн `baseURL`-ийг `api`-ийн түлхүүр рүү (`backoffice`, `finance` ...). */
function clientName(baseURL: string | undefined): string {
  const entry = Object.entries(apiConfig()).find(([, url]) => url === baseURL)
  return entry?.[0] ?? ''
}

function parseBody(data: unknown): Record<string, unknown> {
  if (typeof data !== 'string' || data.length === 0) return {}
  try {
    const parsed: unknown = JSON.parse(data)
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as Record<string, unknown>)
      : {}
  } catch {
    // FormData (зураг upload) ба JSON биш body — демо backend уншдаггүй.
    return {}
  }
}

/**
 * Axios-ийн сүлжээний давхаргын оронд. `transformRequest`-ийн дараа
 * дуудагддаг тул `data` нь JSON string байна.
 */
export async function demoAdapter(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  const data = handleDemoRequest({
    client: clientName(config.baseURL),
    method: config.method ?? 'get',
    path: config.url ?? '',
    body: parseBody(config.data),
    params: (config.params as Record<string, unknown> | undefined) ?? {},
  })

  return { data, status: 200, statusText: 'OK', headers: {}, config }
}
