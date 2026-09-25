import type { ExchangeUser } from './exchange-user-model'

export type ExchangeUserDto = {
  id?: string
  email?: string
  binanceEmail?: string
  firstName?: string
  lastName?: string
  subAccountId?: string
  canTrade?: boolean
  canWithdraw?: boolean
  isWhitelistEnabled?: boolean
  kycLevel?: number
  vipLevel?: number
  status?: number
  created_at?: string
}

export function toExchangeUser(dto: ExchangeUserDto): ExchangeUser {
  return {
    id: dto.id ?? '',
    email: dto.email ?? '',
    binanceEmail: dto.binanceEmail,
    firstName: dto.firstName,
    lastName: dto.lastName,
    subAccountId: dto.subAccountId,
    canTrade: dto.canTrade,
    canWithdraw: dto.canWithdraw,
    isWhitelistEnabled: dto.isWhitelistEnabled,
    kycLevel: dto.kycLevel,
    vipLevel: dto.vipLevel,
    status: dto.status,
    createdAt: dto.created_at,
  }
}
