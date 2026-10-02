import { toCrystalCustomer, toCrystalTransfer } from '../crystal-dto'

describe('crystal dto', () => {
  it('цент дүнг доллар болгож мөрөөр хадгална', () => {
    const transfer = toCrystalTransfer({
      id: 't',
      fiat: 123456,
      currency: 'usdt',
      amount: 1234.56,
    })
    expect(transfer.amountUsd).toEqual({ raw: '1234.56', currency: 'USD' })
    expect(transfer.amount.currency).toBe('USDT')
    expect(transfer.riskyUsd).toBeUndefined()
  })

  it('харилцагчийн нэр байхгүй бол token', () => {
    expect(toCrystalCustomer({ token: 'abc' }).name).toBe('abc')
  })
})
