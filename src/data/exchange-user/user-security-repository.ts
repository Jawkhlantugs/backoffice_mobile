import { clients } from '@/core/network/clients'
import { unwrap } from '@/core/network/envelope'

import { toUserSecurity, type UserSecurityDto } from './user-security-dto'
import type { MfaName, UserSecurity } from './user-security-model'

/**
 * Endpoint: `security.service.ts` (`security-info`, `reset-mfa`,
 * `account-enable`) + `compliance` (`*-ban`). Бүгд эрх өөрчилдөг тул
 * дуудагч тал ConfirmSheet + шалтгаан заавал ашиглана (§1.5).
 */
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
}
