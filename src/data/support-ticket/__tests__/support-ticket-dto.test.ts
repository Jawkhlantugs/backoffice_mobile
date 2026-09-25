import { toSupportTicket } from '../support-ticket-dto'

describe('toSupportTicket', () => {
  it('user объектын email-ийг хэрэглэгчийн нэр болгоно', () => {
    const ticket = toSupportTicket({
      user: { email: 'client@example.com', id: 'u-1' },
    })
    expect(ticket.requesterLabel).toBe('client@example.com')
    expect(ticket.requesterId).toBe('u-1')
  })

  it('user массив нь string бол шууд хэрэглэнэ', () => {
    expect(toSupportTicket({ user: 'client@example.com' }).requesterLabel).toBe(
      'client@example.com',
    )
  })

  it('user байхгүй бол userId/uid-руу шилжинэ', () => {
    expect(toSupportTicket({ userId: 'uid-9' }).requesterLabel).toBe('uid-9')
    expect(toSupportTicket({ uid: 'uid-5' }).requesterId).toBe('uid-5')
  })

  it('танихгүй статусыг new болгоно', () => {
    expect(toSupportTicket({ status: 'archived' }).status).toBe('new')
  })

  it('танихгүй priority-г undefined болгоно', () => {
    expect(toSupportTicket({ priority: 'urgent' }).priority).toBeUndefined()
  })

  it('agent.email эсвэл assignee-ийг хариуцагч болгоно', () => {
    expect(
      toSupportTicket({ agent: { email: 'lead@xmeta.mn' } }).assignee,
    ).toBe('lead@xmeta.mn')
    expect(toSupportTicket({ assignee: 'lead2@xmeta.mn' }).assignee).toBe(
      'lead2@xmeta.mn',
    )
  })

  it('notes/ticket_message/ticketMessage-ийн эхнийхийг агуулга болгоно', () => {
    expect(toSupportTicket({ notes: 'a', ticket_message: 'b' }).message).toBe(
      'a',
    )
    expect(toSupportTicket({ ticketMessage: 'c' }).message).toBe('c')
  })

  it('вэб админы бүтэн хариуг задална', () => {
    const ticket = toSupportTicket({
      id: 't-1',
      title: 'Нэвтэрч чадахгүй байна',
      user: { email: 'client@example.com' },
      status: 'open',
      priority: 'high',
      category: { categoryNameMn: 'Нэвтрэлт' },
      created_at: '2026-09-20T10:00:00Z',
    })

    expect(ticket).toMatchObject({
      id: 't-1',
      title: 'Нэвтэрч чадахгүй байна',
      requesterLabel: 'client@example.com',
      status: 'open',
      priority: 'high',
      categoryLabel: 'Нэвтрэлт',
    })
  })
})
