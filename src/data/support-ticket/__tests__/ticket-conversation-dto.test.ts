import {
  toConversationPage,
  readSocketFrame,
  toTicketMessage,
} from '../ticket-conversation-dto'

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

  it('text талбарыг ч агуулга болгоно', () => {
    expect(toTicketMessage({ text: 'hi' }).message).toBe('hi')
  })

  it('user/customer илгээгчийг харилцагч, бусдыг ажилтан гэж үзнэ', () => {
    expect(toTicketMessage({ senderType: 'USER' }).fromCustomer).toBe(true)
    expect(toTicketMessage({ sender_type: 'customer' }).fromCustomer).toBe(true)
    expect(toTicketMessage({ sender: { type: 'support' } }).fromCustomer).toBe(
      false,
    )
    expect(toTicketMessage({}).fromCustomer).toBe(false)
  })

  it('тоон id-г string болгоно', () => {
    expect(toTicketMessage({ id: 42 }).id).toBe('42')
  })
})

describe('toConversationPage', () => {
  it('вэбийн адил body-г data-аас түрүүлж уншина', () => {
    const page = toConversationPage({
      body: { items: [{ id: 'b' }] },
      data: { items: [{ id: 'd' }] },
    })
    expect(page.items).toEqual([{ id: 'b' }])
  })

  it('envelope code-ийг шалгахгүй, list түлхүүрийг ч уншина', () => {
    const page = toConversationPage({
      code: 200,
      data: { list: [{ id: 'x' }], total: 1 },
    })
    expect(page.items).toHaveLength(1)
    expect(page.total).toBe(1)
  })

  it('объект cursor-ийг string болгоно', () => {
    const page = toConversationPage({
      items: [],
      lastEvaluatedKey: { pk: 'a' },
    })
    expect(page.lastEvaluatedKey).toBe('{"pk":"a"}')
  })

  it('танихгүй хэлбэрт хоосон жагсаалт буцаана', () => {
    expect(toConversationPage(null).items).toEqual([])
  })
})

describe('readSocketFrame', () => {
  const AT = '2026-10-26T14:00:00.000Z'
  const read = (frame: unknown) =>
    readSocketFrame(JSON.stringify(frame), 't-1', AT)

  it('хэрэглэгчийн аппын conversation.send frame-ийг уншина', () => {
    const frame = read({
      method: 'conversation.send',
      params: {
        ticketId: 't-1',
        message: '<p>Сайн байна уу</p>',
        senderId: 'u-1',
        senderType: 'user',
        attachments: [],
        sendAt: 1792980000000,
      },
      id: 7,
    })
    expect(frame?.isNewMessage).toBe(true)
    expect(frame?.messages).toEqual([
      {
        id: '',
        ticketId: 't-1',
        message: '<p>Сайн байна уу</p>',
        senderId: 'u-1',
        fromCustomer: true,
        createdAt: 1792980000000,
      },
    ])
  })

  it('JSON-RPC id-г мессежийн id болгохгүй', () => {
    const frame = read({
      method: 'conversation.send',
      params: { ticketId: 't-1', message: 'hi', senderType: 'user' },
      id: 3,
    })
    expect(frame?.messages[0]?.id).toBe('')
  })

  it('tchId-ийн _tk-г хасаж, data.list хэлбэрийг ч уншина', () => {
    const frame = read({
      data: {
        list: [
          { id: 'm-1', tchId: 't-1_tk', message: 'a', senderType: 'end_user' },
        ],
      },
    })
    expect(frame?.messages).toHaveLength(1)
    expect(frame?.messages[0]).toMatchObject({
      id: 'm-1',
      fromCustomer: true,
      createdAt: AT,
    })
  })

  it('root дээрх ticketId-г дотор мессежтэй нийлүүлнэ', () => {
    const frame = read({
      type: 'conversation.send',
      ticketId: 't-1',
      payload: { message: 'b', senderType: 'support' },
    })
    expect(frame?.messages[0]).toMatchObject({
      message: 'b',
      fromCustomer: false,
    })
  })

  it('ticket-гүй conversation.send ирвэл жагсаалтыг дахин татуулна', () => {
    const frame = read({
      method: 'conversation.send',
      params: { message: 'x' },
    })
    expect(frame).toEqual({ isNewMessage: true, messages: [] })
  })

  it('өөр ticket, ping, JSON биш frame-д мессеж үүсгэхгүй', () => {
    expect(read({ data: { ticketId: 't-2', message: 'x' } })).toEqual({
      isNewMessage: false,
      messages: [],
    })
    expect(read({ action: 'pong' })?.isNewMessage).toBe(false)
    expect(readSocketFrame('not json', 't-1')).toBeNull()
  })
})
