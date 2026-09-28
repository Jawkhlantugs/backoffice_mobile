import { clients } from '@/core/network/clients'
import { unwrap, unwrapList, unwrapObject } from '@/core/network/envelope'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'

import { handleDemoRequest, resetDemoBackend } from '../demo-backend'
import { demoMode } from '../demo-mode'

jest.mock('@/services/auth/cognito-auth-service', () => ({
  cognitoAuth: { idToken: jest.fn(), signOut: jest.fn() },
}))

const request = (
  client: string,
  method: string,
  path: string,
  body: Record<string, unknown> = {},
) => handleDemoRequest({ client, method, path, body, params: {} })

beforeEach(() => resetDemoBackend())

describe('demoMode.matches', () => {
  it('имэйлийн том жижиг үсэг, зайг үл тоомсорлоно', () => {
    expect(demoMode.matches('  Review@Example.com ', 'demo-pass')).toBe(true)
  })

  it('нууц үг яг таарахгүй бол татгалзана', () => {
    expect(demoMode.matches('review@example.com', 'Demo-pass')).toBe(false)
    expect(demoMode.matches('other@example.com', 'demo-pass')).toBe(false)
  })
})

describe('demo backend', () => {
  it('профайл ба цэсийг бодит repository-гийн хэлбэрээр буцаана', () => {
    const profile = unwrapObject<{ id: string; email: string }>(
      request('backoffice', 'get', '/auth/info'),
      'profile',
    )
    expect(profile).toMatchObject({
      id: 'demo-admin',
      email: 'review@example.com',
    })
  })

  it('жагсаалтыг статусаар шүүж, хуудаслана', () => {
    const page = unwrapList<{ status: string }>(
      request('backoffice', 'post', '/admin/leave-requests/list', {
        status: 'PENDING',
        current: 1,
        pageSize: 2,
      }),
      'leave',
    )
    expect(page.items).toHaveLength(2)
    expect(page.total).toBe(4)
    expect(page.items.every((item) => item.status === 'PENDING')).toBe(true)
  })

  it('үйлдэл төлөвийг өөрчилнө, reset нь анхны өгөгдөлд буцаана', () => {
    request('backoffice', 'post', '/admin/leave-requests/leave-1/review', {
      status: 'APPROVED',
    })
    const read = () =>
      unwrapObject<{ status: string }>(
        request('backoffice', 'get', '/admin/leave-requests/leave-1'),
        'leave',
      )
    expect(read().status).toBe('APPROVED')

    resetDemoBackend()
    expect(read().status).toBe('PENDING')
  })

  it('finance action нь `{ code: 0 }` дугтуйтай', () => {
    const response = request('finance', 'post', '/crypto-withdraw/action', {
      historyId: 'cw-1',
      action: 'APPROVE',
    })
    expect(response).toMatchObject({ code: 0 })
  })

  it('өөр client-ийн ижил замтай хүсэлтийг таарахгүй', () => {
    expect(() => request('finance', 'get', '/auth/info')).toThrow(
      expect.objectContaining({ kind: 'api', statusCode: 501 }),
    )
  })

  it('бүртгэлгүй жагсаалт хоосон ирнэ', () => {
    const page = unwrapList(
      request('backoffice', 'post', '/spot/orders/list'),
      'spot',
    )
    expect(page.items).toEqual([])
  })

  it('бүртгэлгүй үйлдэл хэрэглэгчид ойлгомжтой алдаа өгнө', () => {
    expect(() =>
      request('finance', 'post', '/transfer/mnt', { amount: 1 }),
    ).toThrow(expect.objectContaining({ statusCode: 501 }))
  })
})

describe('clients + демо горим', () => {
  afterEach(() => demoMode.exit())

  it('сүлжээ рүү гарахгүй, token ч асуухгүй', async () => {
    demoMode.enter()

    const response = await clients.backoffice.get('/auth/info')

    expect(unwrap<{ id: string }>(response.data).id).toBe('demo-admin')
    expect(cognitoAuth.idToken).not.toHaveBeenCalled()
  })

  it('бүртгэлгүй үйлдэл AppException болж буцна', async () => {
    demoMode.enter()

    await expect(
      clients.finance.post('/transfer/mnt', { amount: 1 }),
    ).rejects.toMatchObject({ kind: 'api', statusCode: 501 })
  })
})
