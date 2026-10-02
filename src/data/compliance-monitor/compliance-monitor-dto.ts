import type { MonitorUser } from './compliance-monitor-model'

export type MonitorUserDto = {
  userId: string
  email?: string
  description?: string
  threshold?: number
  cryptoDeposit?: boolean
  cryptoWithdrawal?: boolean
  fiatDeposit?: boolean
  fiatWithdrawal?: boolean
  status?: string
  createdAt?: string | number
  metadata?: {
    addedAt?: string | number
    addedBy?: string
  } | null
}

export function toMonitorUser(dto: MonitorUserDto): MonitorUser {
  return {
    userId: dto.userId,
    email: dto.email || undefined,
    description: dto.description || undefined,
    threshold: String(dto.threshold ?? ''),
    cryptoDeposit: dto.cryptoDeposit ?? false,
    cryptoWithdrawal: dto.cryptoWithdrawal ?? false,
    fiatDeposit: dto.fiatDeposit ?? false,
    fiatWithdrawal: dto.fiatWithdrawal ?? false,
    status: dto.status ?? '',
    createdAt: dto.createdAt,
    addedAt: dto.metadata?.addedAt,
    addedBy: dto.metadata?.addedBy || undefined,
  }
}
