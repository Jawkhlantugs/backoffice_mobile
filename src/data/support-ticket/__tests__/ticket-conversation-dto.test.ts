import { toTicketMessage } from '../ticket-conversation-dto'

describe('toTicketMessage', () => {
  it('message эсвэл content-ийн эхнийхийг агуулга болгоно', () => {
    expect(toTicketMessage({ message: 'a', content: 'b' }).message).toBe('a')
    expect(toTicketMessage({ content: 'b' }).message).toBe('b')
  })

  it('id байхгүй бол uid-руу шилжинэ', () => {
    expect(toTicketMessage({ uid: 'msg-1' }).id).toBe('msg-1')
  })

  it('createdAt эсвэл created_at-ийн эхнийхийг авна', () => {
    expect(
      toTicketMessage({ created_at: '2026-09-20T10:00:00Z' }).createdAt,
    ).toBe('2026-09-20T10:00:00Z')
  })
})
