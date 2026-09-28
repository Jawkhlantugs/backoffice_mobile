import type { AdminUser } from './session-store'

/** Вэбийн `isTaskAdmin` / `isPrivilegedWeeklyReportViewer` — хоёулаа ижил дүрэм. */
const PRIVILEGED_GROUP_ID = '4'
const PRIVILEGED_GROUP_NAMES = new Set(['Super Admin', 'Directors'])

/**
 * Бүх ажилтны task, хэлтсийн weekly report-ыг харах эрх. Зөвхөн UI-ын
 * шийдвэр — сервер өөрөө шалгана.
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
