import { create } from 'zustand'

import { demoMode } from '@/core/demo/demo-mode'
import { queryClient } from '@/core/query/query-client'
import type { AdminMenuTree } from '@/data/auth/admin-menu-dto'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'

/**
 * Нэвтэрсэн админы төлөв. **Зөвхөн санах ойд** — апп хаагдахад алга болно
 * (§1.4). Дискэнд зөвхөн хэл, theme, биометрикийн туг л үлдэнэ.
 */
export type AdminUser = {
  id: string
  email: string
  name?: string
  /** Office-ын эрх (tasks "Бүгд", weekly report хэлтсээр) — вэбийн `auth.user`. */
  adminGroupId?: string
  adminGroupName?: string
  department?: string
  /** `/admin/admin-menus/my`-аас ирсэн зөвшөөрөгдсөн цэс — вэбийн sidebar-тай
   * ижил бүтэц (баг → бүлэг → мөр). */
  menu: AdminMenuTree
}

export type SessionStatus =
  | 'loading'
  | 'signedOut'
  /** Нэвтэрсэн ч биометрик түгжээ хаалттай. */
  | 'locked'
  | 'signedIn'

type SessionState = {
  status: SessionStatus
  user: AdminUser | null
  /** Цэс хамгийн сүүлд татагдсан мөч — `useMenuRefresh` хуучирсныг нь шийднэ. */
  menuLoadedAt: number
  setUser: (user: AdminUser) => void
  /** Хүсэлт явж байхад өөр админ нэвтэрсэн бол хуучин цэсийг тавихгүй. */
  setMenu: (userId: string, menu: AdminMenuTree) => void
  /** Апп асахад: профайл ба түгжээний төлөвийг нэг дор тавина. */
  restore: (user: AdminUser, locked: boolean) => void
  setStatus: (status: SessionStatus) => void
  lock: () => void
  unlock: () => void
  /** Cognito-оос гарч, санах ойн бүх өгөгдлийг цэвэрлэнэ. */
  signOut: () => Promise<void>
}

export const useSessionStore = create<SessionState>((set) => ({
  status: 'loading',
  user: null,
  menuLoadedAt: 0,
  setUser: (user) =>
    set({ user, status: 'signedIn', menuLoadedAt: Date.now() }),
  setMenu: (userId, menu) =>
    set((state) =>
      state.user?.id === userId
        ? { user: { ...state.user, menu }, menuLoadedAt: Date.now() }
        : state,
    ),
  restore: (user, locked) =>
    set({
      user,
      status: locked ? 'locked' : 'signedIn',
      menuLoadedAt: Date.now(),
    }),
  setStatus: (status) => set({ status }),
  lock: () => set((state) => (state.user ? { status: 'locked' } : state)),
  unlock: () => set((state) => (state.user ? { status: 'signedIn' } : state)),
  signOut: async () => {
    if (demoMode.isActive()) {
      // Демогийн cache бодит нэвтрэлтийн дэлгэц дээр харагдахгүй байх ёстой.
      demoMode.exit()
      queryClient.clear()
      set({ user: null, status: 'signedOut' })
      return
    }
    // Cognito унасан ч локал төлөвийг заавал цэвэрлэнэ — эс бөгөөс апп
    // нэвтэрсэн мэт харагдсаар байна.
    try {
      await cognitoAuth.signOut()
    } finally {
      set({ user: null, status: 'signedOut' })
    }
  },
}))

/** React-ээс гадуур (interceptor) дуудахад. */
export const sessionActions = {
  signOut: () => useSessionStore.getState().signOut(),
  lock: () => useSessionStore.getState().lock(),
  isSignedIn: () => useSessionStore.getState().status === 'signedIn',
}
