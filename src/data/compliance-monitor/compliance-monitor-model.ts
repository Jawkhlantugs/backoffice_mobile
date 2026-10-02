/** `compliance.types.ts`-ийн `ComplianceMonitorUser`. */
export const MONITOR_USER_STATUSES = ['monitoring', 'paused'] as const

export type MonitorUser = {
  userId: string
  email?: string
  description?: string
  /** Сэрэмжлүүлэх босго — валютгүй тоо (вэбийн форм). */
  threshold: string
  cryptoDeposit: boolean
  cryptoWithdrawal: boolean
  fiatDeposit: boolean
  fiatWithdrawal: boolean
  status: string
  createdAt?: string | number
  addedAt?: string | number
  addedBy?: string
}
