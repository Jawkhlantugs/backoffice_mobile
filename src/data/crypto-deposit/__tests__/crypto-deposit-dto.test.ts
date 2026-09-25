import { toCryptoDeposit } from '../crypto-deposit-dto'

describe('toCryptoDeposit', () => {
  it('coinSymbol байвал түүнийг ашиглана', () => {
    expect(toCryptoDeposit({ amount: 1, coinSymbol: 'USDT' }).amount).toEqual({
      raw: 1,
      currency: 'USDT',
    })
  })

  it('coinSymbol байхгүй бол coin.coin-руу шилжинэ', () => {
    expect(
      toCryptoDeposit({ amount: 2, coin: { coin: 'BTC' } }).amount,
    ).toEqual({ raw: 2, currency: 'BTC' })
  })

  it('хэрэглэгчийн имэйлийг User объектоос авна', () => {
    const deposit = toCryptoDeposit({
      User: { id: 'u-1', email: 'a@xmeta.mn' },
    })
    expect(deposit.userEmail).toBe('a@xmeta.mn')
    expect(deposit.userId).toBe('u-1')
  })
})
