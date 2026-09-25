import type { BalanceItem, UserCurrentBalance } from './user-balance-model'

export type BalanceItemDto = {
  asset?: string
  free?: number
  freeze?: number
  usdtValuation?: number
}

export type UserCurrentBalanceDto = {
  spot?: BalanceItemDto[]
  futures?: BalanceItemDto[]
  fiat?: BalanceItemDto[]
  total?: {
    overall?: { usdtValuation?: number; mntValuation?: number }
  }
}

function toBalanceItem(dto: BalanceItemDto): BalanceItem {
  const asset = dto.asset ?? ''
  return {
    asset,
    free: { raw: dto.free ?? 0, currency: asset },
    freeze: { raw: dto.freeze ?? 0, currency: asset },
    usdtValuation: { raw: dto.usdtValuation ?? 0, currency: 'USDT' },
  }
}

export function toUserCurrentBalance(
  dto: UserCurrentBalanceDto,
): UserCurrentBalance {
  return {
    spot: (dto.spot ?? []).map(toBalanceItem),
    futures: (dto.futures ?? []).map(toBalanceItem),
    fiat: (dto.fiat ?? []).map(toBalanceItem),
    totalUsdtValuation: {
      raw: dto.total?.overall?.usdtValuation ?? 0,
      currency: 'USDT',
    },
    totalMntValuation: {
      raw: dto.total?.overall?.mntValuation ?? 0,
      currency: 'MNT',
    },
  }
}
