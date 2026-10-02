import type {
  AdminAccount,
  AdminMenuGroup,
  AdminMenuRow,
  AdminPermission,
  AdminRoleGroup,
} from './admin-management-model'

export type AdminMenuGroupDto = {
  id: string
  name?: string
  created_at?: string
}

export type AdminPermissionDto = {
  id: string
  name?: string
  description?: string
  created_at?: string
}

export type AdminRoleGroupDto = {
  id: string
  name?: string
  permissions?: AdminPermissionDto[] | null
  created_at?: string
}

export type AdminMenuDto = {
  id: string
  name?: string
  icon?: string
  path?: string
  order?: number
  team?: string
  permission?: AdminPermissionDto | null
  children?: AdminMenuDto[] | null
  created_at?: string
}

export type AdminAccountDto = {
  id: string
  email?: string
  adminGroupId?: string | null
  adminGroup?: { id?: string; name?: string } | null
  department?: string | null
  status?: string
  isEnabled?: boolean
  userCreateDate?: string | null
  created_at?: string
}

export function toAdminMenuGroup(dto: AdminMenuGroupDto): AdminMenuGroup {
  return { id: dto.id, name: dto.name ?? '', createdAt: dto.created_at ?? '' }
}

export function toAdminPermission(dto: AdminPermissionDto): AdminPermission {
  return {
    id: dto.id,
    name: dto.name ?? '',
    description: dto.description || undefined,
    createdAt: dto.created_at ?? '',
  }
}

export function toAdminRoleGroup(dto: AdminRoleGroupDto): AdminRoleGroup {
  return {
    id: dto.id,
    name: dto.name ?? '',
    permissions: (dto.permissions ?? []).map((p) => p.name ?? p.id),
    createdAt: dto.created_at ?? '',
  }
}

/** Цэсний модыг эцэг → хүүхэд дарааллаар (`order`-оор) хавтгайлна. */
export function flattenAdminMenus(
  menus: readonly AdminMenuDto[],
  depth = 0,
  parent?: string,
): AdminMenuRow[] {
  return [...menus]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .flatMap((menu) => {
      const children = menu.children ?? []
      const row: AdminMenuRow = {
        id: menu.id,
        name: menu.name ?? '',
        path: menu.path || undefined,
        icon: menu.icon || undefined,
        team: menu.team || undefined,
        order: menu.order ?? 0,
        depth,
        parent,
        permission: menu.permission?.name || undefined,
        childCount: children.length,
        createdAt: menu.created_at ?? '',
      }
      return [row, ...flattenAdminMenus(children, depth + 1, row.name)]
    })
}

export function toAdminAccount(dto: AdminAccountDto): AdminAccount {
  return {
    id: dto.id,
    email: dto.email ?? '',
    group: dto.adminGroup?.name || undefined,
    groupId: dto.adminGroupId ?? undefined,
    department: dto.department || undefined,
    status: dto.status ?? '',
    isEnabled: dto.isEnabled ?? false,
    userCreateDate: dto.userCreateDate ?? undefined,
    createdAt: dto.created_at ?? '',
  }
}
