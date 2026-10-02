import { shiftDecimal } from '@/lib/shift-decimal'

import type { CrystalCustomer, CrystalTransfer } from './crystal-model'

const USD = 'USD'
const CENT_PLACES = -2

/** Вэб `fiat / 100` гэж хуваадаг — энд мөрөөр, нарийвчлал алдахгүй. */
function centsToUsd(cents: number | undefined) {
  return { raw: shiftDecimal(cents ?? 0, CENT_PLACES) ?? '0', currency: USD }
}

export type CrystalTransferDto = {
  id: string
  tx?: string
  direction?: string
  address?: string
  amount?: number
  fiat?: number
  risky_volume_fiat?: number
  currency?: string
  alert_grade?: string
  flagged?: string
  riskscore?: number
  customer?: { name?: string; token?: string } | null
  userData?: { email?: string; uid?: string } | null
  status?: string
  time?: number
}

export type CrystalCustomerDto = {
  token: string
  name?: string
  note?: string
  n_txs?: number
  n_addresses?: number
  n_flagged?: number
  fiat_deposit?: number
  fiat_withdrawal?: number
  risky_volume_fiat?: number
  watched?: boolean
  last_added?: number
}

export function toCrystalTransfer(dto: CrystalTransferDto): CrystalTransfer {
  return {
    id: dto.id,
    tx: dto.tx ?? '',
    direction: dto.direction ?? '',
    address: dto.address || undefined,
    amount: {
      raw: dto.amount ?? 0,
      currency: (dto.currency ?? '').toUpperCase(),
    },
    amountUsd: centsToUsd(dto.fiat),
    riskyUsd:
      dto.risky_volume_fiat === undefined
        ? undefined
        : centsToUsd(dto.risky_volume_fiat),
    alertGrade: dto.alert_grade || undefined,
    flagged: dto.flagged || undefined,
    riskScore: dto.riskscore,
    customer:
      dto.userData?.email ||
      dto.customer?.name ||
      dto.customer?.token ||
      undefined,
    status: dto.status ?? '',
    time: dto.time,
  }
}

export function toCrystalCustomer(dto: CrystalCustomerDto): CrystalCustomer {
  return {
    token: dto.token,
    name: dto.name ?? dto.token,
    note: dto.note || undefined,
    transfers: dto.n_txs ?? 0,
    addresses: dto.n_addresses ?? 0,
    flagged: dto.n_flagged ?? 0,
    depositUsd: centsToUsd(dto.fiat_deposit),
    withdrawalUsd: centsToUsd(dto.fiat_withdrawal),
    riskyUsd: centsToUsd(dto.risky_volume_fiat),
    watched: dto.watched ?? false,
    lastAdded: dto.last_added,
  }
}
