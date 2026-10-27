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

  it('customerUid нь вэбийн дарааллаар uid → user_id → userId → user объект', () => {
    expect(
      toSupportTicket({ uid: 'uid-1', user_id: 'snake-1', userId: 'camel-1' })
        .customerUid,
    ).toBe('uid-1')
    expect(
      toSupportTicket({ user_id: 'snake-1', userId: 'camel-1' }).customerUid,
    ).toBe('snake-1')
    expect(
      toSupportTicket({ user: { uid: 'obj-uid', id: 'obj-id' } }).customerUid,
    ).toBe('obj-uid')
    expect(toSupportTicket({ user: { id: 'obj-id' } }).customerUid).toBe(
      'obj-id',
    )
    expect(
      toSupportTicket({ user: 'client@example.com' }).customerUid,
    ).toBeUndefined()
  })

  it('танихгүй статусыг new болгоно', () => {
    expect(toSupportTicket({ status: 'archived' }).status).toBe('new')
  })

  it('priority-г вэбийн адил түүхийгээр нь үлдээнэ', () => {
    expect(toSupportTicket({ priority: 'normal' }).priority).toBe('normal')
    expect(toSupportTicket({ priority: '' }).priority).toBeUndefined()
  })

  it('agent.email эсвэл assignee-ийг хариуцагч болгоно', () => {
    expect(
      toSupportTicket({ agent: { email: 'lead@xmeta.mn' } }).assignee,
    ).toBe('lead@xmeta.mn')
    expect(toSupportTicket({ assignee: 'lead2@xmeta.mn' }).assignee).toBe(
      'lead2@xmeta.mn',
    )
  })

  it('ticketMessage ба дотоод тэмдэглэлийг тусад нь задална', () => {
    const ticket = toSupportTicket({
      notes: 'jawhaaa',
      ticketMessage: 'Backoffixe ticket test',
    })
    expect(ticket.ticketMessage).toBe('Backoffixe ticket test')
    expect(ticket.note).toBe('jawhaaa')
    expect(toSupportTicket({ ticket_message: 'b' }).ticketMessage).toBe('b')
  })

  it('Zendesk-ийн JSON тэмдэглэлийг нууна', () => {
    expect(
      toSupportTicket({
        notes: '{"source":"zendesk","zendesk_ticket_id":12}',
      }).note,
    ).toBeUndefined()
    expect(toSupportTicket({ notes: '   ' }).note).toBeUndefined()
  })

  it('backoffice-ийн бодит хариуг задална', () => {
    const ticket = toSupportTicket({
      id: 'e10b8e2b',
      created_at: '2026-10-26T13:55:46.591508+08:00',
      title: 'Jawkhaa test',
      userId: '2dcfc869',
      user: { id: '2dcfc869', email: 'ancergc@gmail.com' },
      status: 'new',
      priority: 'normal',
      ticketMessage: 'Backoffixe ticket test',
      category: { categoryNameMn: 'Орлого & Зарлага' },
    })

    expect(ticket).toMatchObject({
      requesterLabel: 'ancergc@gmail.com',
      customerUid: '2dcfc869',
      status: 'new',
      priority: 'normal',
      ticketMessage: 'Backoffixe ticket test',
      categoryLabel: 'Орлого & Зарлага',
    })
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
