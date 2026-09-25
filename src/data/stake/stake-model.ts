import type { AmountField } from '@/core/money/format'

/** `stake.types.ts`-ийн `USERS_STAKE_STATUS` — вэбийн enum-ын утгууд. */
export const USER_STAKE_STATUSES = [
  'ongoing',
  'redeemable',
  'redeeming',
  'redeemed',
  'redeem_requested',
  'redeem_requested_manual',
  'cancel_requested',
  'cancel_requested_manual',
  'cancelling',
  'cancelled',
  'pending',
] as const
export type UserStakeStatus = (typeof USER_STAKE_STATUSES)[number]

/**
 * Вэбийн `customActions`: гараар хүссэн цуцлалт/буцаалтыг л админ дараагийн
 * шат руу шилжүүлнэ. Бусад статуст товч гарахгүй.
 */
export function nextManualStatus(status: string): UserStakeStatus | null {
  if (status === 'redeem_requested_manual') return 'redeem_requested'
  if (status === 'cancel_requested_manual') return 'cancel_requested'
  return null
}

/** `userStakeListSchema`. */
export type UserStake = {
  id: string
  uid?: string
  asset: string
  stakeStatus: string
  staked: AmountField
  total: AmountField
  reward: AmountField
  apr?: number
  contractId?: string
  createdAt?: number
  updatedAt?: number
  txnIds: string[]
}

/** `stakeAssetSchema`. */
export type StakeAsset = {
  asset: string
  title?: string
  status?: string
  isEnabled: boolean
  maxSize?: AmountField
  usedMaxSize?: AmountField
  totalStaked?: AmountField
  updatedAt?: number
}

/** `stakeContractSchema`. */
export type StakeContract = {
  id: string
  name: string
  asset: string
  durationDays: number
  apr?: number
  minAmount: AmountField
  maxAmount: AmountField
  totalStaked?: AmountField
  status?: string
  isEnabled: boolean
  cancelPolicies: { fromDay: number; toDay: number; apr: number }[]
}
