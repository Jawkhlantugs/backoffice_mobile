import { toPushNotification } from '../push-notification-dto'

describe('toPushNotification', () => {
  it('isBroadcast нь 1/0 эсвэл boolean байж болно', () => {
    expect(toPushNotification({ isBroadcast: 1 }).isBroadcast).toBe(true)
    expect(toPushNotification({ isBroadcast: 0 }).isBroadcast).toBe(false)
    expect(toPushNotification({ isBroadcast: true }).isBroadcast).toBe(true)
  })

  it('танихгүй статусыг PENDING болгоно', () => {
    expect(toPushNotification({ status: 'ARCHIVED' }).status).toBe('PENDING')
  })

  it('createTime зөвхөн number байвал хадгална (epoch)', () => {
    expect(toPushNotification({ createTime: 1758000000 }).createTime).toBe(
      1758000000,
    )
    expect(
      toPushNotification({ createTime: '2026-09-20' }).createTime,
    ).toBeUndefined()
  })

  it('createdUser/approvedUser объектоос имэйлийг текст болгоно', () => {
    const item = toPushNotification({
      createdUser: { uid: 'u1', email: 'a@x.mn' },
      approvedUser: { uid: 'u2' },
    })
    expect(item.createdUser).toBe('a@x.mn')
    expect(item.approvedUser).toBe('u2')
    expect(toPushNotification({ approvedUser: null }).approvedUser).toBeUndefined()
  })
})
