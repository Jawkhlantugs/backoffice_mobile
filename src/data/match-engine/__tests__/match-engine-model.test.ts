import { toMatchResult } from '../match-engine-dto'
import { isMissingTxin } from '../match-engine-model'

describe('isMissingTxin', () => {
  const both = toMatchResult({
    match_id: 'a',
    maker_txinID: 'tx-1',
    taker_txinID: 'tx-2',
  })
  const noMaker = toMatchResult({
    match_id: 'b',
    maker_txinID: '',
    taker_txinID: 'tx-2',
  })
  const noTaker = toMatchResult({ match_id: 'c', maker_txinID: 'tx-1' })

  it('хоосон мөр ба байхгүй талбарыг хоёуланг дутуу гэж үзнэ', () => {
    expect(isMissingTxin(noMaker, 'maker')).toBe(true)
    expect(isMissingTxin(noTaker, 'taker')).toBe(true)
  })

  it('тал тус бүрээр ба аль нэгээр нь ялгана', () => {
    expect(isMissingTxin(both, 'either')).toBe(false)
    expect(isMissingTxin(noMaker, 'taker')).toBe(false)
    expect(isMissingTxin(noTaker, 'maker')).toBe(false)
    expect(isMissingTxin(noMaker, 'either')).toBe(true)
    expect(isMissingTxin(noTaker, 'either')).toBe(true)
  })
})
