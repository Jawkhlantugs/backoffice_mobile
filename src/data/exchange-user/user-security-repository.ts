import { clients } from '@/core/network/clients'
import { unwrap } from '@/core/network/envelope'

import { cryptoRegistryRepository } from '@/data/crypto-registry/crypto-registry-repository'

import type { BanKind } from './user-ban'
import {
  latestWithdrawBan,
  type BanLog,
  type LatestWithdrawBan,
  type RiskScore,
} from './user-ban-reason'
import {
  toBanLog,
  toRiskScore,
  type BanLogDto,
  type RiskScoreDto,
} from './user-ban-reason-dto'
import { toUserSecurity, type UserSecurityDto } from './user-security-dto'
import type { MfaName, UserSecurity } from './user-security-model'

/**
 * Endpoint: `security.service.ts` (`security-info`, `reset-mfa`,
 * `account-enable`) + `compliance` (`*-ban`). Бүгд эрх өөрчилдөг тул
 * дуудагч тал ConfirmSheet + шалтгаан заавал ашиглана (§1.5).
 */
const WITHDRAW_BAN_LOOKBACK = 50

export const userSecurityRepository = {
  async get(uid: string): Promise<UserSecurity> {
    const response = await clients.security.get('/user/security-info', {
      params: { uid },
    })
    return toUserSecurity(unwrap<UserSecurityDto>(response.data))
  },

  async resetMfa(uid: string, mfaName: MfaName): Promise<void> {
    await clients.security.post('/user/security/reset-mfa', { uid, mfaName })
  },

  async changeEmail(
    uid: string,
    oldEmail: string,
    newEmail: string,
  ): Promise<void> {
    await clients.security.post('/user/change-email', {
      uid,
      oldEmail,
      newEmail,
    })
  },

  /** Битүүмж гаргах — "битүүмжлэх" endpoint вэб админд байхгүй (§1.7). */
  async accountEnable(uid: string): Promise<void> {
    await clients.security.post('/user/account-enable', { uid })
  },

  async withdrawBan(
    uid: string,
    isWithdrawBan: boolean,
    reason: string,
  ): Promise<void> {
    await clients.compliance.post('/user/withdraw-ban', {
      uid,
      isWithdrawBan,
      reason,
    })
  },

  async tradeBan(
    uid: string,
    isTradeBan: boolean,
    reason: string,
  ): Promise<void> {
    await clients.compliance.post('/user/trade-ban', {
      uid,
      isTradeBan,
      reason,
    })
  },

  async futuresBan(
    uid: string,
    isFuturesBan: boolean,
    reason: string,
  ): Promise<void> {
    await clients.compliance.post('/user/futures-ban', {
      uid,
      isFuturesBan,
      reason,
    })
  },

  /** `get{Withdraw,Trade,Futures}BanLog` — сүүлд хориг тавьсан админы бичлэг. */
  async banLog(uid: string, kind: BanKind): Promise<BanLog | null> {
    const response = await clients.compliance.get(`/user/${kind}-ban-log`, {
      params: { uid },
    })
    return toBanLog(unwrap<BanLogDto | null>(response.data))
  },

  /** Эрсдэлийн загвар зөвхөн withdraw-г хаадаг. */
  async riskScore(uid: string): Promise<RiskScore | null> {
    const response = await clients.compliance.get('/user/risk-score', {
      params: { uid },
    })
    return toRiskScore(unwrap<RiskScoreDto | null>(response.data))
  },

  /**
   * Админы лог алгасдаг (whitelist, email, system) хоригийг withdraw-bans
   * хүснэгтээс — вэбтэй ижил 50 мөр.
   */
  async latestWithdrawBan(
    subAccountId: string,
  ): Promise<LatestWithdrawBan | null> {
    const page = await cryptoRegistryRepository.withdrawBans({
      current: 1,
      pageSize: WITHDRAW_BAN_LOOKBACK,
      query: subAccountId,
    })
    return latestWithdrawBan(page.items)
  },
}
