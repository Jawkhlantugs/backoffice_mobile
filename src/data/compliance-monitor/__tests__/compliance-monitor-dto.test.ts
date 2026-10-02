import { toMonitorUser } from '../compliance-monitor-dto'

describe('compliance monitor dto', () => {
  it('metadata-аас нэмсэн админ, огноог гаргана', () => {
    const user = toMonitorUser({
      userId: 'u1',
      threshold: 5000000,
      metadata: { addedBy: 'a@x.mn', addedAt: 1700000000000 },
    })
    expect(user).toMatchObject({
      threshold: '5000000',
      addedBy: 'a@x.mn',
      cryptoDeposit: false,
    })
  })
})
