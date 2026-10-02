import type { AmountField } from '@/core/money/format'

/** Crystal Intelligence monitor — USD дүн backend-ээс цент (÷100). */
export const CRYSTAL_ALERT_GRADES = ['severe', 'high', 'medium'] as const

export type CrystalTransfer = {
  id: string
  tx: string
  direction: string
  address?: string
  amount: AmountField
  amountUsd: AmountField
  riskyUsd?: AmountField
  alertGrade?: string
  flagged?: string
  riskScore?: number
  customer?: string
  status: string
  time?: number
}

export type CrystalCustomer = {
  token: string
  name: string
  note?: string
  transfers: number
  addresses: number
  flagged: number
  depositUsd: AmountField
  withdrawalUsd: AmountField
  riskyUsd: AmountField
  watched: boolean
  lastAdded?: number
}
