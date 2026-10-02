import { toFrcBankWithdraw, toFrcCryptoDeposit } from '../frc-report-dto'

describe('frc report dto', () => {
  it('дүн бүрийг валюттай нь AmountField болгоно', () => {
    const row = toFrcCryptoDeposit({
      depositId: 'd1',
      coin: 'BTC',
      amount: 0.5,
      price: 60000,
      mntPrice: 205000000,
      mntAmount: 102500000,
      rate: 3420,
      uid: 'u',
      subAccountId: 's',
    })
    expect(row.amount).toEqual({ raw: 0.5, currency: 'BTC' })
    expect(row.priceUsd.currency).toBe('USD')
    expect(row.totalMnt).toEqual({ raw: 102500000, currency: 'MNT' })
  })

  it('id байхгүй мөрөнд тогтвортой түлхүүр үүсгэнэ', () => {
    expect(
      toFrcBankWithdraw({ uid: 'u1', date: '2026-01-01', amount_mnt: 5000 }).id,
    ).toBe('u1-2026-01-01-5000')
  })
})
