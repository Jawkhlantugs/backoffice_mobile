import { toLeaveRequest } from '../leave-request-dto'

describe('toLeaveRequest', () => {
  it('хэрэглэгчийн имэйлийг хүсэгчийн нэр болгоно', () => {
    const request = toLeaveRequest({
      id: '1',
      adminUserId: 'uid-1',
      adminUser: { email: 'bat@xmeta.mn', department: 'Санхүү' },
    })

    expect(request.requester).toBe('bat@xmeta.mn')
    expect(request.department).toBe('Санхүү')
  })

  it('имэйл байхгүй бол adminUserId-д шилжинэ', () => {
    expect(toLeaveRequest({ adminUserId: 'uid-9' }).requester).toBe('uid-9')
  })

  it('танихгүй чөлөөний төрлийг OTHER болгоно', () => {
    expect(toLeaveRequest({ leaveType: 'SABBATICAL' }).type).toBe('OTHER')
  })

  it('танихгүй статусыг PENDING болгоно', () => {
    expect(toLeaveRequest({ status: 'ESCALATED' }).status).toBe('PENDING')
  })

  it('requestType заагаагүй бол хоногоор гэж үзнэ', () => {
    expect(toLeaveRequest({}).unit).toBe('day')
    expect(toLeaveRequest({ requestType: 'hour' }).unit).toBe('hour')
  })

  it('дуусах огноо ирээгүй бол эхлэх огноог хэрэглэнэ', () => {
    const request = toLeaveRequest({ startDate: '2026-09-22' })
    expect(request.endDate).toBe('2026-09-22')
  })

  it('вэб админы бүтэн хариуг задална', () => {
    const request = toLeaveRequest({
      id: 'lr-42',
      leaveType: 'ANNUAL',
      requestType: 'day',
      startDate: '2026-09-22',
      endDate: '2026-09-26',
      reason: 'Гэр бүлийн аялал',
      status: 'APPROVED',
      reviewer: { email: 'lead@xmeta.mn' },
      reviewNote: 'Зөвшөөрлөө',
      created_at: '2026-09-18T10:04:00Z',
    })

    expect(request).toMatchObject({
      id: 'lr-42',
      type: 'ANNUAL',
      unit: 'day',
      status: 'APPROVED',
      reviewer: 'lead@xmeta.mn',
      reviewNote: 'Зөвшөөрлөө',
    })
  })
})
