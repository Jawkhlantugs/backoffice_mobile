import {
  toPartner,
  toPartnerCommission,
  toPartnerPayout,
  toPartnerReferral,
  toPartnerTier,
} from '../partner-dto'

describe('partner dto', () => {
  it('identity нь `user` дотроос, орлого нь USD дүн', () => {
    const partner = toPartner({
      id: 'p1',
      user: { email: 'a@x.mn', firstName: 'Бат', lastName: 'Болд' },
      tier: { id: 't1', name: 'Gold' },
      status: 'active',
      totalReferrals: 4,
      totalEarnings: 12.5,
      createdAt: '2026-01-01',
    })
    expect(partner.email).toBe('a@x.mn')
    expect(partner.name).toBe('Бат Болд')
    expect(partner.tier).toBe('Gold')
    expect(partner.totalEarnings).toEqual({ raw: 12.5, currency: 'USD' })
  })

  it('шимтгэлийн дүн нь өөрийн asset-ээр, volume нь USD', () => {
    const row = toPartnerCommission({
      id: 'c1',
      asset: 'USDT',
      commissionAmount: 0.1234,
      volumeUsd: 1000,
      commissionRate: 0.2,
      rebateAmount: 0.01,
      status: 'paid',
      tradeDate: '2026-01-02',
    })
    expect(row.commission).toEqual({ raw: 0.1234, currency: 'USDT' })
    expect(row.volumeUsd.currency).toBe('USD')
    expect(row.rebate.currency).toBe('USDT')
  })

  it('payout-ын partner шошго: имэйл → partnerId', () => {
    expect(toPartnerPayout({ id: 'x', partnerId: 'pid' }).partner).toBe('pid')
    expect(
      toPartnerPayout({
        id: 'x',
        partnerId: 'pid',
        partner: { id: 'pid', user: { email: 'p@x.mn' } },
        amount: 50,
        currency: 'USDT',
      }),
    ).toMatchObject({
      partner: 'p@x.mn',
      amount: { raw: 50, currency: 'USDT' },
    })
  })

  it('referral-ын код нь линкээс, байхгүй бол partner-ийн кодоос', () => {
    expect(
      toPartnerReferral({
        id: 'r',
        partner: { id: 'p', referralCode: 'MAIN' },
        referralLink: null,
      }).code,
    ).toBe('MAIN')
    expect(
      toPartnerReferral({
        id: 'r',
        partner: { id: 'p', referralCode: 'MAIN' },
        referralLink: { code: 'LINK2' },
      }).code,
    ).toBe('LINK2')
  })

  it('дээд хэмжээ null бол хязгааргүй (undefined)', () => {
    expect(
      toPartnerTier({ id: 't', maxVolume: null }).maxVolume,
    ).toBeUndefined()
    expect(toPartnerTier({ id: 't', maxVolume: 500 }).maxVolume).toEqual({
      raw: 500,
      currency: 'USD',
    })
  })
})
