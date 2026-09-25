import { toUserSecurity } from '../user-security-dto'

describe('toUserSecurity', () => {
  it('kebab-case status талбаруудыг boolean болгоно', () => {
    const security = toUserSecurity({
      'software-token': { status: 1 },
      'anti-phishing': { status: 0 },
      'white-list': { status: 1 },
      sms: { status: 0, mobile: '99001122' },
    })

    expect(security.softwareTokenEnabled).toBe(true)
    expect(security.antiPhishingEnabled).toBe(false)
    expect(security.whiteListEnabled).toBe(true)
    expect(security.smsEnabled).toBe(false)
    expect(security.smsMobile).toBe('99001122')
  })

  it('canTrade/canWithdraw нь тоо эсвэл boolean байж болно', () => {
    expect(toUserSecurity({ canTrade: 1 }).canTrade).toBe(true)
    expect(toUserSecurity({ canTrade: 0 }).canTrade).toBe(false)
    expect(toUserSecurity({ canWithdraw: true }).canWithdraw).toBe(true)
    expect(toUserSecurity({}).canTrade).toBeUndefined()
  })

  it('email.last-changed-email-ийг задална', () => {
    expect(
      toUserSecurity({ email: { 'last-changed-email': 'old@xmeta.mn' } })
        .lastChangedEmail,
    ).toBe('old@xmeta.mn')
  })
})
