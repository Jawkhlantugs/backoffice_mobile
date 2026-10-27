import type { ExchangeUser } from './exchange-user-model'
import type { UserSecurity } from './user-security-model'

export type BanKind = 'withdraw' | 'trade' | 'futures'

export type BanState = Record<BanKind, boolean>

/**
 * Вэбийн `ban-controls.tsx`-ийн `getIsFrozen`: `can*` туг байвал түүнийг
 * үнэн гэж үзнэ (эрсдэлийн загвар, whitelist зэрэг бусад эх сурвалжийн
 * хоригийг ч тусгадаг), байхгүй үед л `is*Ban`-д шилжинэ.
 */
function isFrozen(
  canDo: boolean | undefined,
  explicitBan: boolean | undefined,
) {
  return canDo === undefined ? explicitBan === true : !canDo
}

export function banState(
  user: ExchangeUser,
  security: UserSecurity | undefined,
): BanState {
  return {
    withdraw: isFrozen(
      security?.canWithdraw ?? user.canWithdraw,
      security?.isWithdrawBan,
    ),
    trade: isFrozen(security?.canTrade ?? user.canTrade, security?.isTradeBan),
    futures: isFrozen(
      security?.futuresTrade ?? user.futuresTrade,
      security?.isFuturesBan,
    ),
  }
}

/** Futures данс нээгээгүй хэрэглэгчид futures хоригийг харуулахгүй (вэбтэй ижил). */
export function visibleBanKinds(user: ExchangeUser): BanKind[] {
  return user.futuresTrade === undefined
    ? ['withdraw', 'trade']
    : ['withdraw', 'trade', 'futures']
}

/**
 * Хориг байвал MFA reset, Account enable-ийг нууна — хоригийг тойрох зам
 * болохгүйн тулд. KYC-гүй хэрэглэгчийн `can*` туг утгагүй тул тооцохгүй.
 */
export function hasAnyBan(
  user: ExchangeUser,
  security: UserSecurity | undefined,
): boolean {
  const explicit =
    security?.isWithdrawBan === true ||
    security?.isTradeBan === true ||
    security?.isFuturesBan === true
  if (explicit) return true
  if ((user.kycLevel ?? 0) <= 0) return false
  const state = banState(user, security)
  return visibleBanKinds(user).some((kind) => state[kind])
}

/** Вэб шалтгааны өмнө `ADMIN:<имэйл>: ` залгадаг — аудитын бүртгэлд хэн хийснийг үлдээнэ. */
export function banReason(adminEmail: string | undefined, reason: string) {
  const admin = adminEmail?.trim().toLowerCase() || 'unknown'
  return `ADMIN:${admin}: ${reason.trim()}`
}
