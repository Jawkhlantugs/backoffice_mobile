import { toFuturesTransferRequest } from '../futures-transfer-dto'

describe('toFuturesTransferRequest', () => {
  it('танихгүй статусыг PENDING болгоно', () => {
    expect(toFuturesTransferRequest({ status: 'UNKNOWN' }).status).toBe(
      'PENDING',
    )
  })

  it('userId байхгүй бол accountId-руу шилжинэ', () => {
    expect(toFuturesTransferRequest({ accountId: 'acc-1' }).userId).toBe(
      'acc-1',
    )
  })

  it('asset-аар дүнгийн валютыг тогтооно', () => {
    expect(
      toFuturesTransferRequest({ amount: 100, asset: 'USDT' }).amount,
    ).toEqual({
      raw: 100,
      currency: 'USDT',
    })
  })
})
