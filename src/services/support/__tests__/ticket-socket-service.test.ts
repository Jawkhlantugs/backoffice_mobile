import {
  conversationSendMessage,
  isPingMessage,
  pingMessage,
  pongMessage,
} from '../ticket-socket-service'

jest.mock('@/services/auth/cognito-auth-service', () => ({
  cognitoAuth: { idToken: jest.fn(), signOut: jest.fn() },
}))

describe('ticket-socket-service', () => {
  it('heartbeat-ийг вэбийн адил action түлхүүрээр илгээнэ', () => {
    expect(JSON.parse(pingMessage())).toEqual({ action: 'ping' })
    expect(JSON.parse(pongMessage())).toEqual({ action: 'pong' })
  })

  it('серверийн ping-ийг type/action/method-ын алинаар ч танина', () => {
    expect(isPingMessage('{"action":"ping"}')).toBe(true)
    expect(isPingMessage('{"type":"PING"}')).toBe(true)
    expect(isPingMessage('{"method":"ping"}')).toBe(true)
  })

  it('ping биш эсвэл JSON биш мессежийг ping гэж үзэхгүй', () => {
    expect(isPingMessage('{"action":"pong"}')).toBe(false)
    expect(isPingMessage('{"method":"conversation.send"}')).toBe(false)
    expect(isPingMessage('not json')).toBe(false)
    expect(isPingMessage(undefined)).toBe(false)
  })

  it('conversation.send-д харилцагчийн uid-ийг оруулна', () => {
    const payload = JSON.parse(
      conversationSendMessage({
        ticketId: 't-1',
        message: '<p>hi</p>',
        senderId: 'admin-1',
        uid: 'customer-1',
      }),
    )
    expect(payload).toEqual({
      method: 'conversation.send',
      params: {
        ticketId: 't-1',
        message: '<p>hi</p>',
        senderId: 'admin-1',
        senderType: 'support',
        attachments: [],
        uid: 'customer-1',
      },
    })
  })
})
