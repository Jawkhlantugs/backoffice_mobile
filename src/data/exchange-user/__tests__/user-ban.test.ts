import type { ExchangeUser } from '../exchange-user-model'
import { banReason, banState, hasAnyBan, visibleBanKinds } from '../user-ban'
import type { UserSecurity } from '../user-security-model'

const user: ExchangeUser = {
  id: 'u-1',
  email: 'bat@xmeta.mn',
  kycLevel: 1,
  canTrade: true,
  canWithdraw: true,
  futuresTrade: true,
}

const security: UserSecurity = {
  uid: 'u-1',
  softwareTokenEnabled: true,
  antiPhishingEnabled: false,
  whiteListEnabled: false,
  smsEnabled: false,
}

describe('banState', () => {
  it('can* туг байвал түүнийг үнэн гэж үзнэ', () => {
    const state = banState(
      { ...user, canWithdraw: false },
      { ...security, isWithdrawBan: false },
    )
    expect(state).toEqual({ withdraw: true, trade: false, futures: false })
  })

  it('security-ийн can* нь хэрэглэгчийнхээс давуу', () => {
    expect(banState(user, { ...security, canTrade: false }).trade).toBe(true)
  })

  it('can* байхгүй үед is*Ban-д шилжинэ', () => {
    const state = banState(
      { id: 'u-2', email: 'a@b.mn' },
      { ...security, isFuturesBan: true },
    )
    expect(state).toEqual({ withdraw: false, trade: false, futures: true })
  })
})

describe('visibleBanKinds', () => {
  it('futures данс нээгээгүй бол futures-ийг нууна', () => {
    expect(visibleBanKinds({ ...user, futuresTrade: undefined })).toEqual([
      'withdraw',
      'trade',
    ])
  })
})

describe('hasAnyBan', () => {
  it('хориггүй хэрэглэгч', () => {
    expect(hasAnyBan(user, security)).toBe(false)
  })

  it('ил хориг KYC-ээс үл хамааран тооцогдоно', () => {
    expect(
      hasAnyBan({ ...user, kycLevel: 0 }, { ...security, isTradeBan: true }),
    ).toBe(true)
  })

  it('KYC-гүй хэрэглэгчийн can* тугийг тооцохгүй', () => {
    expect(
      hasAnyBan({ ...user, kycLevel: 0, canWithdraw: false }, security),
    ).toBe(false)
  })

  it('нуусан futures хориг тооцогдохгүй', () => {
    expect(
      hasAnyBan(
        { ...user, futuresTrade: undefined },
        { ...security, futuresTrade: false },
      ),
    ).toBe(false)
  })
})

describe('banReason', () => {
  it('админы имэйлийг угтвар болгоно', () => {
    expect(banReason(' Admin@X-Meta.com ', ' сэжигтэй ')).toBe(
      'ADMIN:admin@x-meta.com: сэжигтэй',
    )
  })

  it('имэйлгүй бол unknown', () => {
    expect(banReason(undefined, 'x')).toBe('ADMIN:unknown: x')
  })
})
