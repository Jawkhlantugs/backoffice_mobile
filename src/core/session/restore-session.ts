import { isAppException } from '@/core/errors/app-exception'
import { adminRepository } from '@/data/auth/admin-repository'
import { biometricService } from '@/services/biometric/biometric-service'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'
import { logger } from '@/lib/logger'

import { useSessionStore } from './session-store'

/**
 * Апп асахад хадгалагдсан session-ийг сэргээнэ. Буцаах утга нь дэлгэцэд
 * харуулах алдаа (`null` = амжилттай эсвэл login руу шилжсэн).
 */
export async function restoreSession(): Promise<unknown> {
  const { restore, setStatus, signOut } = useSessionStore.getState()

  if (!(await cognitoAuth.isAuthenticated())) {
    setStatus('signedOut')
    return null
  }

  // Профайлыг түгжээнээс **өмнө** татна: session сэргээхэд `user` хоосон
  // үлдвэл түгжээ тайлах товч юу ч хийхгүй, апп гацна.
  try {
    const [profile, locked] = await Promise.all([
      adminRepository.profile(),
      biometricService.isEnabled(),
    ])
    restore(profile, locked)
    return null
  } catch (error) {
    logger.warn('Session сэргээх амжилтгүй', error)
    // Зөвхөн session хүчингүй бол гаргана — сүлжээ тасарсан төдийд хүчинтэй
    // token-оо устгаж, админыг дахин нэвтрүүлэх учиргүй.
    if (isAppException(error) && error.kind === 'auth') {
      await signOut()
      return null
    }
    return error
  }
}
