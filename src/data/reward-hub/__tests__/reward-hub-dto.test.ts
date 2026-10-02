import { toUserReward, toWelcomeTask } from '../reward-hub-dto'

describe('reward hub dto', () => {
  it('welcome task-ийн дүн нь asset-ээрээ, түлхүүр нь rewardId#orderId', () => {
    const task = toWelcomeTask({
      rewardId: 'WELCOME',
      orderId: 2,
      asset: 'USDT',
      minAmount: 1,
      maxAmount: 5,
      taskCode: 'KYC',
    })
    expect(task.key).toBe('WELCOME#2')
    expect(task.maxAmount).toEqual({ raw: 5, currency: 'USDT' })
  })

  it('claimedAt null бол undefined', () => {
    expect(
      toUserReward({ userId: 'u', claimedAt: null }).claimedAt,
    ).toBeUndefined()
  })
})
