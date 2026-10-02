import type {
  StakeAsset,
  StakeContract,
  StakeStatistics,
  UserStake,
} from './stake-model'

export type UserStakeDto = {
  id: string
  uid?: string
  stakeContractId?: string
  stakeStatus?: string
  stakedAmount?: number
  totalAmount?: number
  rewardAmount?: number
  apr?: number
  asset?: string
  createTime?: number
  updateTime?: number
  metadata?: { history?: { txnId?: string; binanceTxnId?: string }[] }
}

export type StakeAssetDto = {
  asset?: string
  stakeAssetTitle?: string
  status?: string
  isEnabled?: number
  maxSize?: number
  usedMaxSize?: number
  totalStakedAmountSize?: number
  updateTime?: number
}

export type StakeContractDto = {
  stakeContractId?: string
  contractId?: string
  stakeContractName?: string
  asset?: string
  duration?: number
  apr?: number
  minAmount?: number
  maxAmount?: number
  totalStakedAmount?: number
  status?: string
  isEnabled?: number
  cancelPolicies?: { fromDay: number; toDay: number; apr: number }[]
}

const amount = (raw: number | undefined, currency: string) =>
  raw === undefined ? undefined : { raw, currency }

export function toUserStake(dto: UserStakeDto): UserStake {
  const asset = dto.asset ?? ''
  return {
    id: dto.id,
    uid: dto.uid,
    asset,
    stakeStatus: dto.stakeStatus ?? '',
    staked: { raw: dto.stakedAmount ?? 0, currency: asset },
    total: { raw: dto.totalAmount ?? 0, currency: asset },
    reward: { raw: dto.rewardAmount ?? 0, currency: asset },
    apr: dto.apr,
    contractId: dto.stakeContractId,
    createdAt: dto.createTime,
    updatedAt: dto.updateTime,
    txnIds: (dto.metadata?.history ?? []).flatMap((item) =>
      item.txnId ? [item.txnId] : item.binanceTxnId ? [item.binanceTxnId] : [],
    ),
  }
}

export function toStakeAsset(dto: StakeAssetDto): StakeAsset {
  const asset = dto.asset ?? ''
  return {
    asset,
    title: dto.stakeAssetTitle,
    status: dto.status,
    isEnabled: dto.isEnabled === 1,
    maxSize: amount(dto.maxSize, asset),
    usedMaxSize: amount(dto.usedMaxSize, asset),
    totalStaked: amount(dto.totalStakedAmountSize, asset),
    updatedAt: dto.updateTime,
  }
}

export function toStakeContract(dto: StakeContractDto): StakeContract {
  const asset = dto.asset ?? ''
  return {
    id: dto.stakeContractId ?? dto.contractId ?? dto.stakeContractName ?? '',
    name: dto.stakeContractName ?? '',
    asset,
    durationDays: dto.duration ?? 0,
    apr: dto.apr,
    minAmount: { raw: dto.minAmount ?? 0, currency: asset },
    maxAmount: { raw: dto.maxAmount ?? 0, currency: asset },
    totalStaked: amount(dto.totalStakedAmount, asset),
    status: dto.status,
    isEnabled: dto.isEnabled === 1,
    cancelPolicies: dto.cancelPolicies ?? [],
  }
}

export type StakeStatisticsDto = {
  total?: number
  general?: { active?: number; failed?: number }
  status?: Record<string, number | undefined>
}

/** Вэбийн графикийн дараалал — тоо 0 байсан ч бүх статус харагдана. */
const STATISTIC_STATUSES = [
  'redeemable',
  'ongoing',
  'cancelled',
  'redeeming',
  'canceling',
  'cancel_requested',
  'cancel_requested_manual',
  'redeem_requested',
  'redeem_requested_manual',
] as const

export function toStakeStatistics(dto: StakeStatisticsDto): StakeStatistics {
  return {
    total: dto.total ?? 0,
    active: dto.general?.active ?? 0,
    failed: dto.general?.failed ?? 0,
    byStatus: STATISTIC_STATUSES.map((status) => ({
      status,
      count: dto.status?.[status] ?? 0,
    })),
  }
}
