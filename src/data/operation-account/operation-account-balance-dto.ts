import { compareDecimal } from '@/lib/compare-decimal'

import type { OperationAccountBalance } from './operation-account-balance-model'

export type OperationAccountBalanceDto = {
  userAsset?: {
    asset?: string
    free?: string | number
    locked?: string | number
  }[]
  relevantBalances?: {
    asset?: string
    balance?: string | number
    updateTime?: number | string
  }[]
  accountDetails?: { name?: string; description?: string } | null
}

const isPositive = (raw: string | number | undefined) =>
  raw !== undefined && (compareDecimal(String(raw), '0') ?? 0) > 0

export function toOperationAccountBalance(
  dto: OperationAccountBalanceDto,
): OperationAccountBalance {
  return {
    name: dto.accountDetails?.name || undefined,
    description: dto.accountDetails?.description || undefined,
    assets: (dto.userAsset ?? [])
      .filter((item) => item.asset && isPositive(item.free))
      .map((item) => ({
        asset: item.asset ?? '',
        free: { raw: item.free ?? 0, currency: item.asset ?? '' },
        locked:
          item.locked === undefined || !isPositive(item.locked)
            ? undefined
            : { raw: item.locked, currency: item.asset ?? '' },
      })),
    balances: (dto.relevantBalances ?? [])
      .filter((item) => item.asset)
      .map((item) => ({
        asset: item.asset ?? '',
        balance: { raw: item.balance ?? 0, currency: item.asset ?? '' },
        updatedAt: item.updateTime,
      })),
  }
}
