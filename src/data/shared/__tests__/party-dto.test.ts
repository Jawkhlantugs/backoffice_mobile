import { partyLabel } from '../party-dto'

describe('partyLabel', () => {
  it('имэйл → нэр → subAccountId → id', () => {
    expect(partyLabel({ email: 'a@x.mn', name: 'A' })).toBe('a@x.mn')
    expect(partyLabel({ firstName: 'Бат', lastName: 'Болд' })).toBe('Бат Болд')
    expect(partyLabel({ subAccountId: '123', id: 'u1' })).toBe('123')
    expect(partyLabel(null)).toBeUndefined()
  })
})
