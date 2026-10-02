import { useEffect } from 'react'
import { AppState } from 'react-native'

import { useSessionStore } from '@/core/session/session-store'
import { adminRepository } from '@/data/auth/admin-repository'
import { logger } from '@/lib/logger'

/** Вэбийн sidebar-ийн `staleTime`-тай ижил. */
const MENU_STALE_MS = 5 * 60_000

async function refreshIfStale(): Promise<void> {
  const { status, user, menuLoadedAt, setMenu } = useSessionStore.getState()
  if (status !== 'signedIn' || !user) return
  if (Date.now() - menuLoadedAt < MENU_STALE_MS) return

  try {
    setMenu(user.id, await adminRepository.menu())
  } catch (error) {
    // Хуучин цэс хэвээр үлдэнэ — эрхийг сервер өөрөө шалгадаг.
    logger.warn('Цэс шинэчлэх амжилтгүй', error)
  }
}

/**
 * Вэб админд эрх хасагдсан бол апп дахин асахыг хүлээлгүй цэс, route guard
 * шинэчлэгдэнэ. Түгжээ тайлагдах ба апп идэвхжих үед шалгана.
 */
export function useMenuRefresh(): void {
  const status = useSessionStore((store) => store.status)

  useEffect(() => {
    if (status !== 'signedIn') return

    void refreshIfStale()
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') void refreshIfStale()
    })
    return () => subscription.remove()
  }, [status])
}
