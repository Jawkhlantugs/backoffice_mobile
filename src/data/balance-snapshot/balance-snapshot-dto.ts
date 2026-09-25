import type { BalanceSnapshot, SnapshotBalance } from './balance-snapshot-model'

type SnapshotBalanceDto = {
  asset?: string
  free?: number
  freeze?: number
  usdtValuation?: number
}

export type BalanceSnapshotDto = {
  id: string
  userId?: string
  User?: { email?: string } | null
  subAccountId?: string
  date?: string
  usdtValuation?: number
  mntValuation?: number
  spotBalances?: SnapshotBalanceDto[]
  futuresBalances?: SnapshotBalanceDto[]
  bankBalances?: SnapshotBalanceDto[]
}

function toBalance(dto: SnapshotBalanceDto): SnapshotBalance {
  const asset = dto.asset ?? ''
  return {
    asset,
    free: { raw: dto.free ?? 0, currency: asset },
    freeze: { raw: dto.freeze ?? 0, currency: asset },
    usdtValuation: { raw: dto.usdtValuation ?? 0, currency: 'USDT' },
  }
}

export function toBalanceSnapshot(dto: BalanceSnapshotDto): BalanceSnapshot {
  return {
    id: dto.id,
    user: dto.User?.email ?? dto.userId,
    subAccountId: dto.subAccountId ?? '',
    date: dto.date ?? '',
    usdtValuation: { raw: dto.usdtValuation ?? 0, currency: 'USDT' },
    mntValuation: { raw: dto.mntValuation ?? 0, currency: 'MNT' },
    spot: (dto.spotBalances ?? []).map(toBalance),
    futures: (dto.futuresBalances ?? []).map(toBalance),
    bank: (dto.bankBalances ?? []).map(toBalance),
  }
}
