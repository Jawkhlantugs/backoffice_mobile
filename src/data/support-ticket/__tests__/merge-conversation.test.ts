import {
  LOCAL_MESSAGE_PREFIX,
  mergeConversation,
  type TicketMessage,
} from '../ticket-conversation-model'

const msg = (
  id: string,
  message: string,
  createdAt: TicketMessage['createdAt'],
  fromCustomer = false,
): TicketMessage => ({ id, ticketId: 't-1', message, fromCustomer, createdAt })

describe('mergeConversation', () => {
  it('REST ба WS-ийн ижил id-тайг нэг удаа харуулна', () => {
    const merged = mergeConversation(
      [msg('a', 'hi', '2026-10-26T10:00:00Z', true)],
      [msg('a', 'hi', '2026-10-26T10:00:00Z', true)],
    )
    expect(merged).toHaveLength(1)
  })

  it('серверээс ижил текст ирмэгц optimistic мөрийг арилгана', () => {
    const local = msg(
      `${LOCAL_MESSAGE_PREFIX}1`,
      '<p>Test</p>',
      '2026-10-26T10:01:00Z',
    )
    expect(mergeConversation([], [local])).toEqual([local])
    expect(
      mergeConversation(
        [msg('srv', '<p>Test</p>', '2026-10-26T10:01:01Z')],
        [local],
      ),
    ).toHaveLength(1)
  })

  it('цагаар өсөхөөр эрэмбэлж, огноогүйг сүүлд тавина', () => {
    const merged = mergeConversation(
      [msg('b', 'b', '2026-10-26T10:05:00Z'), msg('x', 'x', undefined)],
      [msg('a', 'a', 1792980000)],
    )
    expect(merged.map((m) => m.id)).toEqual(['a', 'b', 'x'])
  })

  it('id-гүй WS мессеж серверийнхтэй ижил бол нэг удаа харуулна', () => {
    const merged = mergeConversation(
      [msg('srv', 'hi', '2026-10-26T10:00:05Z', true)],
      [msg('', 'hi', '2026-10-26T10:00:00Z', true)],
    )
    expect(merged.map((m) => m.id)).toEqual(['srv'])
  })

  it('ижил текстийг өөр цагт бичсэн бол хоёуланг үлдээнэ', () => {
    const merged = mergeConversation(
      [msg('a', 'ok', '2026-10-26T10:00:00Z', true)],
      [msg('', 'ok', '2026-10-26T10:05:00Z', true)],
    )
    expect(merged).toHaveLength(2)
  })
})
