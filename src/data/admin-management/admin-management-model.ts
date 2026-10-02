/** Вэбийн `portal/admin-management/*` ба `user-management/admin-users`. */
export type AdminMenuGroup = {
  id: string
  name: string
  createdAt: string
}

/** Цэсний мод хавтгайлсан — `depth` нь доголын түвшин. */
export type AdminMenuRow = {
  id: string
  name: string
  path?: string
  icon?: string
  team?: string
  order: number
  depth: number
  parent?: string
  permission?: string
  childCount: number
  createdAt: string
}

export type AdminPermission = {
  id: string
  name: string
  description?: string
  createdAt: string
}

export type AdminRoleGroup = {
  id: string
  name: string
  permissions: string[]
  createdAt: string
}

export const ADMIN_ACCOUNT_ENABLED = ['true', 'false'] as const

export type AdminAccount = {
  id: string
  email: string
  group?: string
  groupId?: string
  department?: string
  status: string
  isEnabled: boolean
  userCreateDate?: string
  createdAt: string
}
