import type {
  RewardTransaction,
  UserReward,
  WelcomeTask,
} from './reward-hub-model'

export type WelcomeTaskDto = {
  rewardId?: string
  orderId?: number
  title?: string
  description?: string
  asset?: string
  minAmount?: number
  maxAmount?: number
  taskCode?: string
}

export type UserRewardDto = {
  userId?: string
  rewardId?: string
  currentTaskCode?: string
  status?: string
  userType?: string
  createdAt?: number
  expiredAt?: number
  claimedAt?: number | null
  claimableAmount?: number
  claimedAmount?: number
  minClaimableAmount?: number
  asset?: string
}

export type RewardTransactionDto = {
  taskId: string
  rewardId?: string
  userId?: string
  status?: string
  amount?: number
  asset?: string
  taskCode?: string
  subAccountId?: string
  requestedAt?: number
  transferTime?: number | null
  createdAt?: number
}

export function toWelcomeTask(dto: WelcomeTaskDto): WelcomeTask {
  const asset = dto.asset ?? ''
  const rewardId = dto.rewardId ?? ''
  const orderId = dto.orderId ?? 0
  return {
    key: `${rewardId}#${orderId}`,
    rewardId,
    orderId,
    title: dto.title ?? '',
    description: dto.description || undefined,
    taskCode: dto.taskCode ?? '',
    minAmount: { raw: dto.minAmount ?? 0, currency: asset },
    maxAmount: { raw: dto.maxAmount ?? 0, currency: asset },
  }
}

export function toUserReward(dto: UserRewardDto): UserReward {
  const asset = dto.asset ?? ''
  const userId = dto.userId ?? ''
  const rewardId = dto.rewardId ?? ''
  return {
    key: `${userId}#${rewardId}`,
    userId,
    rewardId,
    currentTaskCode: dto.currentTaskCode || undefined,
    status: dto.status ?? '',
    userType: dto.userType || undefined,
    claimable: { raw: dto.claimableAmount ?? 0, currency: asset },
    claimed: { raw: dto.claimedAmount ?? 0, currency: asset },
    minClaimable: { raw: dto.minClaimableAmount ?? 0, currency: asset },
    createdAt: dto.createdAt,
    expiredAt: dto.expiredAt,
    claimedAt: dto.claimedAt ?? undefined,
  }
}

export function toRewardTransaction(
  dto: RewardTransactionDto,
): RewardTransaction {
  return {
    taskId: dto.taskId,
    rewardId: dto.rewardId ?? '',
    userId: dto.userId ?? '',
    subAccountId: dto.subAccountId || undefined,
    status: dto.status ?? '',
    taskCode: dto.taskCode ?? '',
    amount: { raw: dto.amount ?? 0, currency: dto.asset ?? '' },
    requestedAt: dto.requestedAt,
    transferTime: dto.transferTime ?? undefined,
    createdAt: dto.createdAt,
  }
}
