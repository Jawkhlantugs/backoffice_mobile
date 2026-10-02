import { toOperationAccountBalance } from '../operation-account-balance-dto'

describe('operation account balance dto', () => {
  it('тэгтэй хөрөнгийг хасна, дүнг number-гүй харьцуулна', () => {
    const balance = toOperationAccountBalance({
      userAsset: [
        { asset: 'USDT', free: '0.00000001' },
        { asset: 'BTC', free: '0' },
        { asset: 'ETH', free: 0, locked: '1' },
      ],
      relevantBalances: [{ asset: 'MNT', balance: '1000' }],
    })
    expect(balance.assets.map((item) => item.asset)).toEqual(['USDT'])
    expect(balance.balances[0]?.balance).toEqual({
      raw: '1000',
      currency: 'MNT',
    })
  })
})
