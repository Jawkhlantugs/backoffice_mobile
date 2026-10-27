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
  futuresTrade?: number | null
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
    // `null` = хэрэглэгч futures нээгээгүй — вэб энэ үед futures хоригийг нуудаг.
    futuresTrade:
      dto.futuresTrade === null || dto.futuresTrade === undefined
        ? undefined
        : dto.futuresTrade === 1,
    isWhitelistEnabled: dto.isWhitelistEnabled,
    kycLevel: dto.kycLevel,
    vipLevel: dto.vipLevel,
    status: dto.status,
    createdAt: dto.created_at,
  }
}
