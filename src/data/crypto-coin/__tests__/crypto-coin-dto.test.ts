import { uniqueCoins } from '../crypto-coin-dto'
import { matchesAddressRule } from '../crypto-coin-model'

describe('uniqueCoins', () => {
  it('ижил coin-ын эхний мөрийг авч, network-гүй мөрийг хаяна', () => {
    const coins = uniqueCoins([
      {
        coin: 'USDT',
        name: 'Tether',
        networkList: [{ network: 'TRX', addressRegex: '^T' }, {}],
      },
      { coin: 'USDT', name: 'Duplicate' },
      { name: 'coin-гүй' },
    ])

    expect(coins).toEqual([
      {
        coin: 'USDT',
        name: 'Tether',
        networks: [{ network: 'TRX', name: undefined, addressRegex: '^T' }],
      },
    ])
  })
})

describe('matchesAddressRule', () => {
  it('regex байвал шалгана', () => {
    const network = { network: 'TRX', addressRegex: '^T[1-9A-Za-z]{33}$' }
    expect(matchesAddressRule(network, 'T' + 'a'.repeat(33))).toBe(true)
    expect(matchesAddressRule(network, '0xabc')).toBe(false)
  })

  it('regex байхгүй эсвэл эвдэрхий бол зөвшөөрнө', () => {
    expect(matchesAddressRule({ network: 'X' }, 'anything')).toBe(true)
    expect(
      matchesAddressRule({ network: 'X', addressRegex: '([' }, 'anything'),
    ).toBe(true)
  })
})
