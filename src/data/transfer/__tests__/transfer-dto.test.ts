import { formatMoney } from '@/core/money/format'
import { parseMoney } from '@/core/money/money'

import {
  operationCryptoAssets,
  operationMntAsset,
  operationUnsupportedAssets,
} from '../transfer-dto'
import { apiFromAccount, transferPath } from '../transfer-model'
import { amountMatches, validateTransfer } from '../transfer-validation'

const summary = (assets: ReturnType<typeof operationCryptoAssets>) =>
  assets.map(
    (item) =>
      `${item.asset}:${formatMoney(item.available, { groupSeparator: '' })}`,
  )

describe('operation balance', () => {
  const dto = {
    userAsset: [
      { asset: 'USDT', free: '12.5' },
      { asset: 'BTC', free: 0 },
      { asset: 'MNT', free: '100' },
      { asset: 'DOGE', free: '3' },
    ],
    relevantBalances: [
      { asset: 'USDT', balance: 999 },
      { asset: 'ETH', balance: '0.1' },
      { asset: 'MNT', balance: '310557.20' },
    ],
  }

  it('crypto: MNT-гүй, эерэг, userAsset эхэлж, давхардалгүй', () => {
    expect(
      summary(operationCryptoAssets(dto)).map((s) => s.split(':')[0]),
    ).toEqual(['USDT', 'ETH'])
    expect(operationCryptoAssets(dto)[0]?.available.minorUnits).toBe(
      1_250_000_000n,
    )
  })

  it('MNT нь relevantBalances-аас', () => {
    expect(operationMntAsset(dto)[0]?.available.minorUnits).toBe(31_055_720n)
  })

  it('бүртгэлгүй coin-ыг тусад нь нэрлэнэ, тэг үлдэгдэлтэйг үгүй', () => {
    expect(operationUnsupportedAssets(dto)).toEqual(['DOGE'])
    expect(
      operationUnsupportedAssets({
        userAsset: [{ asset: 'DOGE', free: '0.000' }],
      }),
    ).toEqual([])
  })
})

describe('transfer routing', () => {
  it('asset ба чиглэлээр endpoint сонгоно', () => {
    expect(transferPath('MNT', 'op-to-op')).toBe('/transfer/mnt')
    expect(transferPath('USDT', 'op-to-op')).toBe(
      '/transfer/operation-sub-account',
    )
    expect(transferPath('USDT', 'op-to-user')).toBe('/transfer/sub-account')
    expect(transferPath('USDT', 'user-to-op')).toBe('/transfer/sub-account')
  })

  it('master данс хоосон string болно', () => {
    expect(apiFromAccount('787107359')).toBe('')
    expect(apiFromAccount('123')).toBe('123')
  })
})

describe('validateTransfer', () => {
  const usdt = { asset: 'USDT', available: parseMoney('10', 'USDT') }
  const base = {
    fromAccount: 'op-1',
    toAccount: 'user-1',
    asset: usdt,
    amount: '2.5',
    reason: 'bonus',
    fromUserMissing: false,
    toUserMissing: false,
  }

  it('зөв ноорог Money буцаана', () => {
    const result = validateTransfer(base)
    expect(result.errors).toEqual({})
    expect(result.amount?.minorUnits).toBe(250_000_000n)
  })

  it('имэйл, ижил данс, олдоогүй хэрэглэгчийг барина', () => {
    expect(
      validateTransfer({ ...base, toAccount: 'a@b.mn' }).errors.toAccount,
    ).toBe('emailNotSubAccount')
    expect(
      validateTransfer({ ...base, toAccount: 'op-1' }).errors.toAccount,
    ).toBe('sameAccount')
    expect(
      validateTransfer({ ...base, toUserMissing: true }).errors.toAccount,
    ).toBe('userNotFound')
  })

  it('үлдэгдлээс их, тэг, илүү оронтой дүнг татгалзана', () => {
    expect(
      validateTransfer({ ...base, amount: '10.00000001' }).errors.amount,
    ).toBe('exceedsBalance')
    expect(validateTransfer({ ...base, amount: '0' }).errors.amount).toBe(
      'invalidAmount',
    )
    expect(
      validateTransfer({ ...base, amount: '1.123456789' }).errors.amount,
    ).toBe('invalidAmount')
  })

  it('дахин бичсэн дүнг Money-гээр харьцуулна', () => {
    const amount = parseMoney('2.5', 'USDT')
    expect(amountMatches('2.50', amount)).toBe(true)
    expect(amountMatches('2.4', amount)).toBe(false)
  })
})
