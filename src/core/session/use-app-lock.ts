import { useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { demoMode } from '@/core/demo/demo-mode'
import { biometricService } from '@/services/biometric/biometric-service'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'
import { logger } from '@/lib/logger'
import { messages } from '@/lib/messages'

import { useSessionStore } from './session-store'

/** §1.3 — background-д үүнээс удаан байсан бол биометрик асууна. */
const LOCK_AFTER_MS = 60_000

function isLocked(): boolean {
  return useSessionStore.getState().status === 'locked'
}

/**
 * Биометрик унтраалттай үед түгжихгүй: түгжээд шууд нээх нь дэлгэц
 * анивчуулахаас өөр хамгаалалт өгөхгүй.
 */
async function lockOrRefresh(expired: boolean): Promise<void> {
  if (expired && (await biometricService.isEnabled())) {
    useSessionStore.getState().lock()
    return
  }
  if (demoMode.isActive()) return

  try {
    await cognitoAuth.refresh()
  } catch (error) {
    logger.warn('Token сэргээх амжилтгүй', error)
  }
}

/**
 * Апп background-аас буцаж ирэхэд түгжээ ба token-ыг хариуцна.
 *
 * Хоёр зүйл нэг газар байгаа шалтгаан: хоёулаа "апп дахин идэвхжлээ" гэдэг
 * нэг үйл явдлаас эхэлдэг бөгөөд дараалал нь чухал — эхлээд түгжинэ, дараа
 * нь token сэргээнэ.
 */
export function useAppLock(): void {
  const backgroundedAt = useRef<number | null>(null)

  useEffect(() => {
    function handleChange(next: AppStateStatus) {
      const { status } = useSessionStore.getState()

      if (next === 'background' || next === 'inactive') {
        backgroundedAt.current ??= Date.now()
        return
      }

      if (next !== 'active') return

      const since = backgroundedAt.current
      backgroundedAt.current = null

      if (status === 'signedOut' || status === 'loading') return

      const expired = since !== null && Date.now() - since >= LOCK_AFTER_MS
      void lockOrRefresh(expired)
    }

    const subscription = AppState.addEventListener('change', handleChange)
    return () => subscription.remove()
  }, [])
}

/**
 * Түгжээг тайлах оролдлого. Биометрик унтраалттай эсвэл боломжгүй бол
 * шууд нээнэ — админыг аппаасаа түгжихгүй.
 *
 * Буцаах утга нь **бодит төлөв**: `unlock()` нь профайл ачаалагдаагүй үед
 * юу ч хийхгүй тул "амжилттай" гэж худал мэдээлбэл дэлгэц гацна.
 */
export async function tryUnlock(): Promise<boolean> {
  const { unlock } = useSessionStore.getState()

  if (!isLocked()) return true

  const [available, enabled] = await Promise.all([
    biometricService.isAvailable(),
    biometricService.isEnabled(),
  ])

  if (!available || !enabled) {
    unlock()
    return !isLocked()
  }

  if (
    await biometricService.authenticate(
      messages.auth.unlockReason,
      messages.common.cancel,
    )
  ) {
    unlock()
  }

  return !isLocked()
}
