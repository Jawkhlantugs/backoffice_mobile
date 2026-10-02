import { clients } from '@/core/network/clients'
import { unwrap, type PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  flattenAdminMenus,
  toAdminAccount,
  toAdminMenuGroup,
  toAdminPermission,
  toAdminRoleGroup,
  type AdminMenuDto,
  type AdminMenuGroupDto,
  type AdminPermissionDto,
  type AdminRoleGroupDto,
} from './admin-management-dto'
import type {
  AdminMenuGroup,
  AdminMenuRow,
  AdminPermission,
  AdminRoleGroup,
} from './admin-management-model'

/** `{menus}` эсвэл шууд массив — `/admin-menus/all` хоёулаа буцааж байсан. */
function asArray<T>(body: T[] | { menus?: T[] } | null): T[] {
  if (Array.isArray(body)) return body
  return body?.menus ?? []
}

/**
 * Endpoint: `admin-menu*.service.ts`, `admin-role.service.ts`,
 * `users.service.ts` (`/users/admins/list`), `{security}/admin-user/*`.
 */
export const adminManagementRepository = {
  async menuGroups(): Promise<AdminMenuGroup[]> {
    const response = await clients.backoffice.get('/admin/admin-menu-groups/')
    return asArray(unwrap<AdminMenuGroupDto[] | null>(response.data)).map(
      toAdminMenuGroup,
    )
  },

  async menus(): Promise<AdminMenuRow[]> {
    const response = await clients.backoffice.get('/admin/admin-menus/all')
    return flattenAdminMenus(
      asArray(
        unwrap<AdminMenuDto[] | { menus?: AdminMenuDto[] } | null>(
          response.data,
        ),
      ),
    )
  },

  async roleGroups(): Promise<AdminRoleGroup[]> {
    const response = await clients.backoffice.get('/admin/admin-roles/groups')
    return asArray(unwrap<AdminRoleGroupDto[] | null>(response.data)).map(
      toAdminRoleGroup,
    )
  },

  async permissions(): Promise<AdminPermission[]> {
    const response = await clients.backoffice.get(
      '/admin/admin-roles/permissions',
    )
    return asArray(unwrap<AdminPermissionDto[] | null>(response.data)).map(
      toAdminPermission,
    )
  },

  accounts: (params: PageParams & { isEnabled?: string; groupId?: string }) =>
    fetchList(clients.backoffice, '/users/admins/list', params, toAdminAccount),

  /** Түр нууц үг имэйлээр очно — вэб дээр Super Admin л. */
  async resetPassword(uid: string): Promise<void> {
    await clients.security.post('/admin-user/reset-password', { uid })
  },

  /** Cognito нэвтрэлтийг хаах/нээх — вэб дээр Super Admin л. */
  async setAccess(uid: string, isEnabled: boolean): Promise<void> {
    await clients.security.post('/admin-user/access', { uid, isEnabled })
  },
}
