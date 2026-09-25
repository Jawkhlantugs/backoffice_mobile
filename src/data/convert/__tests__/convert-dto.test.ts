import { toConvertRecord } from '../convert-dto'

describe('toConvertRecord', () => {
  it('fromAsset/toAsset-аар fromAmount/toAmount-ийн валютыг тогтооно', () => {
    const record = toConvertRecord({
      id: 'c-1',
      fromAmount: 100,
      fromAsset: 'USDT',
      toAmount: 350000,
      toAsset: 'MNT',
      status: 'COMPLETED',
    })

    expect(record.fromAmount).toEqual({ raw: 100, currency: 'USDT' })
    expect(record.toAmount).toEqual({ raw: 350000, currency: 'MNT' })
    expect(record.status).toBe('COMPLETED')
  })

  it('User.id байхгүй бол UserId, brokerUserId-руу шилжинэ', () => {
    expect(toConvertRecord({ UserId: 'uid-9' }).userId).toBe('uid-9')
    expect(toConvertRecord({ brokerUserId: 'broker-1' }).userId).toBe(
      'broker-1',
    )
  })
})
