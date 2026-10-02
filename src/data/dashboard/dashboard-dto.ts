import type { DashboardSummary, RevenueSource } from './dashboard-model'

const MNT = 'MNT'

export type DashboardSummaryDto = {
  totalUsers?: number
  newUsers?: number
  activeUsers?: number
  bankConnectedUsers?: number
  totalTradeVolumeMnt?: number
  totalRevenueMnt?: number
  overallArpuMnt?: number
  totalUserMntBalance?: number
}

export type RevenueSourceDto = { source?: string; amount?: number }

const mnt = (raw: number | undefined) => ({ raw: raw ?? 0, currency: MNT })

export function toDashboardSummary(dto: DashboardSummaryDto): DashboardSummary {
  return {
    totalUsers: dto.totalUsers ?? 0,
    newUsers: dto.newUsers ?? 0,
    activeUsers: dto.activeUsers ?? 0,
    bankConnectedUsers: dto.bankConnectedUsers ?? 0,
    tradeVolume: mnt(dto.totalTradeVolumeMnt),
    revenue: mnt(dto.totalRevenueMnt),
    arpu: mnt(dto.overallArpuMnt),
    userMntBalance: mnt(dto.totalUserMntBalance),
  }
}

export function toRevenueSource(dto: RevenueSourceDto): RevenueSource {
  return { source: dto.source ?? '', amount: mnt(dto.amount) }
}
