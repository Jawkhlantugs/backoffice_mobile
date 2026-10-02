import type { AmountField } from '@/core/money/format'

/** Вэбийн шүүлтүүр — "user_approved" нь админы шийдвэр хүлээж буй. */
export const ASSET_RECOVERY_STATUSES = [
  'user_approved',
  'user_claimed',
  'approved',
  'not_distributed',
] as const

export type AssetRecoveryRecord = {
  id: string
  email: string
  uid: string
  subId?: string
  amount: AmountField
  category?: string
  status: string
  approvedBy?: string
  distributeDate?: string
  distributeHash?: string
  updatedAt?: number
}
