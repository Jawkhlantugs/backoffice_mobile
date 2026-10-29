import { AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { AppErrors } from '@/core/errors/app-exception'
import { sessionActions } from '@/core/session/session-store'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'

import { clients } from '../clients'

jest.mock('@/services/auth/cognito-auth-service', () => ({
  cognitoAuth: { idToken: jest.fn(), refresh: jest.fn() },
}))
jest.mock('@/core/session/session-store', () => ({
  sessionActions: { signOut: jest.fn() },
}))

jest.mock('@/lib/logger', () => ({
  logger: { debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

const idToken = cognitoAuth.idToken as jest.Mock
const refresh = cognitoAuth.refresh as jest.Mock
const signOut = sessionActions.signOut as jest.Mock

/** Статусуудыг дарааллаар буцаадаг adapter — илгээсэн Bearer-ийг тэмдэглэнэ. */
function respondWith(...statuses: number[]) {
  const sent: string[] = []
  clients.backoffice.defaults.adapter = async (
    config: InternalAxiosRequestConfig,
  ) => {
    sent.push(String(config.headers.Authorization))
    const status = statuses.shift() ?? 200
    const response = { status, statusText: '', data: {}, headers: {}, config }
    if (status >= 400) {
      throw new AxiosError('fail', 'ERR_BAD_REQUEST', config, null, response)
    }
    return response
  }
  return sent
}

describe('401 → refresh → дахин илгээх', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    idToken.mockResolvedValueOnce('old').mockResolvedValue('new')
  })

  it('refresh амжилттай бол шинэ token-оор дахин илгээж, гаргахгүй', async () => {
    refresh.mockResolvedValue('new')
    const sent = respondWith(401, 200)

    await expect(clients.backoffice.get('/x')).resolves.toMatchObject({
      status: 200,
    })
    expect(sent).toEqual(['Bearer old', 'Bearer new'])
    expect(signOut).not.toHaveBeenCalled()
  })

  it('дахин илгээсэн ч 401 бол гаргана', async () => {
    refresh.mockResolvedValue('new')
    respondWith(401, 401)

    await expect(clients.backoffice.get('/x')).rejects.toMatchObject({
      kind: 'auth',
    })
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it('session үнэхээр алга (refresh null) бол гаргана', async () => {
    refresh.mockResolvedValue(null)
    respondWith(401)

    await expect(clients.backoffice.get('/x')).rejects.toMatchObject({
      kind: 'auth',
    })
    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it('refresh сүлжээгээр унавал гаргахгүй', async () => {
    refresh.mockRejectedValue(AppErrors.offline())
    respondWith(401)

    await expect(clients.backoffice.get('/x')).rejects.toMatchObject({
      kind: 'network',
    })
    expect(signOut).not.toHaveBeenCalled()
  })

  it('token авах үед сүлжээ унавал хүсэлт явахгүй, гаргахгүй', async () => {
    idToken.mockReset().mockRejectedValue(AppErrors.offline())
    const sent = respondWith(200)

    await expect(clients.backoffice.get('/x')).rejects.toMatchObject({
      kind: 'network',
    })
    expect(sent).toEqual([])
    expect(signOut).not.toHaveBeenCalled()
  })
})
