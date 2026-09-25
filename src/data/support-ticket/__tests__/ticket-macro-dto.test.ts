import { toTicketMacro } from '../ticket-macro-dto'

describe('toTicketMacro', () => {
  it('тоон id-г string болгоно', () => {
    expect(toTicketMacro({ id: 5, name: 'a', value: 'v' }).id).toBe('5')
  })

  it('is_active ирээгүй бол анхнаасаа идэвхтэй гэж үзнэ', () => {
    expect(toTicketMacro({ id: 1 }).isActive).toBe(true)
    expect(toTicketMacro({ id: 1, is_active: false }).isActive).toBe(false)
  })
})
