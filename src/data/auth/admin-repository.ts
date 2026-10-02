import { clients } from '@/core/network/clients'
import { unwrap } from '@/core/network/envelope'
import type { AdminUser } from '@/core/session/session-store'

import { toMenuTree, type AdminMenuTree } from './admin-menu-dto'

/**
 * Нэвтэрсэн админы хувийн мэдээлэл ба эрх.
 *
 * Эрхийг клиент талд таамаглахгүй — `/admin/admin-menus/my` нь сервер талаас
 * зөвшөөрөгдсөн цэсийг буцаана. Апп зөвхөн түүнийг харуулна (§1.7).
 */

type AdminProfileDto = {
  id?: string
  email?: string
  department?: string | null
  adminGroupId?: string | null
  adminGroup?: { name?: string } | null
}

export const adminRepository = {
  async profile(): Promise<AdminUser> {
    const [infoRes, menu] = await Promise.all([
      clients.backoffice.get('/auth/info'),
      adminRepository.menu(),
    ])

    const dto = unwrap<AdminProfileDto>(infoRes.data)

    return {
      id: dto.id ?? '',
      email: dto.email ?? '',
      name: dto.department ?? undefined,
      adminGroupId: dto.adminGroupId ?? undefined,
      adminGroupName: dto.adminGroup?.name?.trim() || undefined,
      department: dto.department ?? undefined,
      menu,
    }
  },

  async menu(): Promise<AdminMenuTree> {
    const response = await clients.backoffice.get('/admin/admin-menus/my')
    return toMenuTree(unwrap(response.data))
  },
}
