import type { AmountField } from '@/core/money/format'

/** Вэбийн `reward-hub.types.ts` — welcome task урамшуулал. */
export const USER_REWARD_STATUSES = [
  'IN_PROGRESS',
  'COMPLETED',
  'REQUESTED',
  'CLAIMED',
  'EXPIRED',
] as const

export const REWARD_TRANSACTION_STATUSES = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
] as const

export type WelcomeTask = {
  key: string
  rewardId: string
  orderId: number
  title: string
  description?: string
  taskCode: string
  minAmount: AmountField
  maxAmount: AmountField
}

export type UserReward = {
  key: string
  userId: string
  rewardId: string
  currentTaskCode?: string
  status: string
  userType?: string
  claimable: AmountField
  claimed: AmountField
  minClaimable: AmountField
  createdAt?: number
  expiredAt?: number
  claimedAt?: number
}

export type RewardTransaction = {
  taskId: string
  rewardId: string
  userId: string
  subAccountId?: string
  status: string
  taskCode: string
  amount: AmountField
  requestedAt?: number
  transferTime?: number
  createdAt?: number
}
