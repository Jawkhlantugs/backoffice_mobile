import { fetchAuthSession } from 'aws-amplify/auth'

import { cognitoAuth } from '../cognito-auth-service'

jest.mock('aws-amplify/auth', () => ({ fetchAuthSession: jest.fn() }))

const fetchSession = fetchAuthSession as jest.Mock

function amplifyError(name: string) {
  return Object.assign(new Error(name), { name })
}

describe('cognitoAuth token', () => {
  beforeEach(() => fetchSession.mockReset())

  it('хүчинтэй session-ийн idToken-ийг буцаана', async () => {
    fetchSession.mockResolvedValue({
      tokens: { idToken: { toString: () => 'id-1' } },
    })
    await expect(cognitoAuth.idToken()).resolves.toBe('id-1')
  })

  it('refresh token хүчингүй (tokens алга) бол null', async () => {
    fetchSession.mockResolvedValue({ tokens: undefined })
    await expect(cognitoAuth.refresh()).resolves.toBeNull()
  })

  it('сүлжээний алдааг null биш network алдаа болгож шиднэ', async () => {
    fetchSession.mockRejectedValue(amplifyError('NetworkError'))
    await expect(cognitoAuth.idToken()).rejects.toMatchObject({
      kind: 'network',
    })
  })

  it('Cognito session-ийг хүчингүй гэвэл null', async () => {
    fetchSession.mockRejectedValue(amplifyError('TokenRevokedException'))
    await expect(cognitoAuth.accessToken()).resolves.toBeNull()
  })
})
