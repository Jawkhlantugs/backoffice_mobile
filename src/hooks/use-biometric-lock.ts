import { useEffect, useState } from 'react'

import { toast } from '@/core/ui/toast-store'
import { logger } from '@/lib/logger'
import { messages } from '@/lib/messages'
import { biometricService } from '@/services/biometric/biometric-service'

export type BiometricLockState = {
  /** Төхөөрөмж дэмжиж, хэрэглэгч Face ID / хурууны хээ бүртгэсэн эсэх. */
  available: boolean
  enabled: boolean
  busy: boolean
  toggle: (next: boolean) => Promise<void>
}

/**
 * Биометрик түгжээний унтраалга.
 *
 * Асаахаас өмнө нэг удаа баталгаажуулна: ажиллахгүй биометрикээр түгжвэл
 * админ аппдаа орох боломжгүй болно.
 */
export function useBiometricLock(): BiometricLockState {
  const [available, setAvailable] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function read() {
      const [hardware, stored] = await Promise.all([
        biometricService.isAvailable(),
        biometricService.isEnabled(),
      ])

      if (cancelled) return
      setAvailable(hardware)
      setEnabled(stored)
    }

    void read()
    return () => {
      cancelled = true
    }
  }, [])

  async function toggle(next: boolean) {
    if (busy) return
    setBusy(true)

    try {
      if (
        next &&
        !(await biometricService.authenticate(
          messages.profile.biometricEnableReason,
        ))
      ) {
        toast.error(messages.profile.biometricFailed)
        return
      }

      await biometricService.setEnabled(next)
      setEnabled(next)
    } catch (error) {
      logger.warn('Биометрик тохиргоо хадгалагдсангүй', error)
      toast.error(messages.errors.unknown)
    } finally {
      setBusy(false)
    }
  }

  return { available, enabled, busy, toggle }
}
