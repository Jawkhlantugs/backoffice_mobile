import { AppErrors } from '@/core/errors/app-exception'
import { adminRepository } from '@/data/auth/admin-repository'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'

import { restoreSession } from '../restore-session'
import { useSessionStore } from '../session-store'

jest.mock('@/services/auth/cognito-auth-service', () => ({
  cognitoAuth: { isAuthenticated: jest.fn(), signOut: jest.fn() },
}))
jest.mock('@/data/auth/admin-repository', () => ({
  adminRepository: { profile: jest.fn() },
}))
jest.mock('@/services/biometric/biometric-service', () => ({
  biometricService: { isEnabled: jest.fn().mockResolvedValue(false) },
}))
jest.mock('@/lib/logger', () => ({
  logger: { debug: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

const isAuthenticated = cognitoAuth.isAuthenticated as jest.Mock
const profile = adminRepository.profile as jest.Mock
const cognitoSignOut = cognitoAuth.signOut as jest.Mock

describe('restoreSession', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useSessionStore.setState({ status: 'loading', user: null })
    isAuthenticated.mockResolvedValue(true)
  })

  it('профайл ирвэл нэвтэрсэн төлөвт шилжинэ', async () => {
    profile.mockResolvedValue({ id: '1', email: 'a@x.mn', menu: [] })

    await expect(restoreSession()).resolves.toBeNull()
    expect(useSessionStore.getState().status).toBe('signedIn')
  })

  it('сүлжээний алдаагаар гаргахгүй — алдааг буцааж, token-ийг үлдээнэ', async () => {
    profile.mockRejectedValue(AppErrors.offline())

    await expect(restoreSession()).resolves.toMatchObject({ kind: 'network' })
    expect(useSessionStore.getState().status).toBe('loading')
    expect(cognitoSignOut).not.toHaveBeenCalled()
  })

  it('session хүчингүй (auth алдаа) бол гаргана', async () => {
    profile.mockRejectedValue(AppErrors.auth('expired'))

    await expect(restoreSession()).resolves.toBeNull()
    expect(useSessionStore.getState().status).toBe('signedOut')
    expect(cognitoSignOut).toHaveBeenCalledTimes(1)
  })

  it('token хадгалагдаагүй бол шууд login', async () => {
    isAuthenticated.mockResolvedValue(false)

    await expect(restoreSession()).resolves.toBeNull()
    expect(useSessionStore.getState().status).toBe('signedOut')
    expect(profile).not.toHaveBeenCalled()
  })
})
