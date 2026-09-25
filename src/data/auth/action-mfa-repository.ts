import { clients } from '@/core/network/clients'
import { AppErrors } from '@/core/errors/app-exception'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'

/**
 * Step-up MFA. Body-д **accessToken** (Bearer дээрх idToken биш) — вэбийн
 * `utils/action-mfa.ts`. Буруу код 401 буцаавал logout хийхгүй
 * (`AUTH_URL_SKIP_LOGOUT`-д `/auth/action-mfa/verify` угтвар таарна).
 */
export const actionMfaRepository = {
  async verifyTransfer(code: string): Promise<void> {
    const accessToken = await cognitoAuth.accessToken()
    if (!accessToken) throw AppErrors.auth('expired')
    await clients.backoffice.post('/auth/action-mfa/verify-transfer', {
      code,
      accessToken,
    })
  },
}
