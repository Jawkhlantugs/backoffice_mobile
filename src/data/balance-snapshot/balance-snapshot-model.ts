import type { AmountField } from '@/core/money/format'

export type SnapshotBalance = {
  asset: string
  free: AmountField
  freeze: AmountField
  usdtValuation: AmountField
}

/** `users.types.ts`-ийн `userBalanceSnapshotSchema` — өдрийн үлдэгдлийн зураг. */
export type BalanceSnapshot = {
  id: string
  user?: string
  subAccountId: string
  date: string
  usdtValuation: AmountField
  mntValuation: AmountField
  spot: SnapshotBalance[]
  futures: SnapshotBalance[]
  bank: SnapshotBalance[]
}
