import type { AmountField } from '@/core/money/format'

/** Вэбийн `DashboardPro` → Overview таб (`/dashboard/overview/*`). */
export type DashboardSummary = {
  totalUsers: number
  newUsers: number
  activeUsers: number
  bankConnectedUsers: number
  tradeVolume: AmountField
  revenue: AmountField
  arpu: AmountField
  userMntBalance: AmountField
}

export type RevenueSource = { source: string; amount: AmountField }
