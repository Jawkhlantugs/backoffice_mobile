import { toMatchResult } from '../match-engine-dto'

describe('match engine dto', () => {
  it('maker/taker талыг тусад нь, дүнг токентой нь уншина', () => {
    const match = toMatchResult({
      match_id: 'm1',
      pair: 'IHC_MNT',
      match_price: '12.5',
      is_cancel: '0',
      maker_amount: '100',
      maker_token: 'IHC',
      maker_is_buyer: '1',
      taker_amount: '1250',
      taker_token: 'MNT',
      taker_txinID: 'tx-9',
    })
    expect(match.cancelled).toBe(false)
    expect(match.maker).toMatchObject({
      amount: { raw: '100', currency: 'IHC' },
      isBuyer: true,
    })
    expect(match.taker.txinId).toBe('tx-9')
    expect(match.maker.txinId).toBeUndefined()
  })

  it("is_cancel '1' бол цуцлагдсан", () => {
    expect(toMatchResult({ match_id: 'x', is_cancel: '1' }).cancelled).toBe(
      true,
    )
  })
})
