import type { CryptoBlockedWallet } from './crypto-blocked-wallet-model'

export type CryptoBlockedWalletDto = {
  id?: string
  created_at?: string
  address?: string
  network?: string
  createdUserId?: string | null
  createdUser?: { id?: string; name?: string; email?: string } | null
  reason?: string
  status?: number
}

export function toCryptoBlockedWallet(
  dto: CryptoBlockedWalletDto,
): CryptoBlockedWallet {
  return {
    id: dto.id ?? '',
    address: dto.address ?? '',
    network: dto.network ?? '',
    createdByLabel:
      dto.createdUser?.name ??
      dto.createdUser?.email ??
      dto.createdUserId ??
      undefined,
    reason: dto.reason,
    status: dto.status ?? 0,
    createdAt: dto.created_at,
  }
}
