import type { AdminUser } from './session-store'

/** Вэбийн `isTaskAdmin` / `isPrivilegedWeeklyReportViewer` / leave-ийн `canViewAll` — гурвуулаа ижил дүрэм. */
const PRIVILEGED_GROUP_ID = '4'
const PRIVILEGED_GROUP_NAMES = new Set(['Super Admin', 'Directors'])

/**
 * Бүх ажилтны task, хэлтсийн weekly report-ыг харах, чөлөө батлах эрх.
 * Зөвхөн UI-ын шийдвэр — сервер өөрөө шалгана.
 */
export function isOfficePrivileged(
  user: AdminUser | null | undefined,
): boolean {
  if (!user) return false
  return (
    user.adminGroupId === PRIVILEGED_GROUP_ID ||
    PRIVILEGED_GROUP_NAMES.has(user.adminGroupName ?? '')
  )
}

const SUPER_ADMIN_GROUP_NAME = 'Super Admin'

/**
 * Админ хэрэглэгчийн нууц үг сэргээх, хандалт хаах — вэбийн
 * `admin-user-detail-content.tsx`-ийн `isSuperAdmin` (Directors биш).
 */
export function isSuperAdmin(user: AdminUser | null | undefined): boolean {
  if (!user) return false
  return (
    user.adminGroupId === PRIVILEGED_GROUP_ID ||
    user.adminGroupName === SUPER_ADMIN_GROUP_NAME
  )
}
