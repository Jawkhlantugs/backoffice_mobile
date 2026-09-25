import { decodeCursor, encodeCursor } from '@/data/shared/cursor'

import { nextManualStatus } from '../stake-model'

describe('stake', () => {
  it('гараар хүссэн статусыг л дараагийн шат руу', () => {
    expect(nextManualStatus('redeem_requested_manual')).toBe('redeem_requested')
    expect(nextManualStatus('cancel_requested_manual')).toBe('cancel_requested')
    expect(nextManualStatus('ongoing')).toBeNull()
  })
})

describe('cursor', () => {
  it('объект cursor-ыг string болгож буцааж задална', () => {
    const key = { pk: 'USER#1', sk: 'STAKE#2' }
    const encoded = encodeCursor(key)
    expect(decodeCursor(encoded)).toEqual(key)
  })

  it('хоосон cursor-ыг "дараагийнх алга" гэж үзнэ', () => {
    expect(encodeCursor(null)).toBeUndefined()
    expect(encodeCursor({})).toBeUndefined()
    expect(encodeCursor('')).toBeUndefined()
  })
})
