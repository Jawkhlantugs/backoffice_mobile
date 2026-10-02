import { useQuery } from '@tanstack/react-query'

import { adminManagementRepository } from '@/data/admin-management/admin-management-repository'

import { useInvalidatingMutation } from './use-invalidating-mutation'
import { usePagedList } from './use-paged-list'

export const useAdminMenuGroups = () =>
  useQuery({
    queryKey: ['admin-menu-groups'],
    queryFn: adminManagementRepository.menuGroups,
  })
export const useAdminMenus = () =>
  useQuery({
    queryKey: ['admin-menus-all'],
    queryFn: adminManagementRepository.menus,
  })
export const useAdminRoleGroups = () =>
  useQuery({
    queryKey: ['admin-role-groups'],
    queryFn: adminManagementRepository.roleGroups,
  })
export const useAdminPermissions = () =>
  useQuery({
    queryKey: ['admin-permissions'],
    queryFn: adminManagementRepository.permissions,
  })

export const useAdminAccounts = (
  search: string,
  filters: { isEnabled?: string; groupId?: string },
) =>
  usePagedList('admin-accounts', adminManagementRepository.accounts, {
    search,
    filters,
  })

export const useResetAdminPassword = () =>
  useInvalidatingMutation('admin-accounts', (uid: string) =>
    adminManagementRepository.resetPassword(uid),
  )

export const useSetAdminAccess = () =>
  useInvalidatingMutation(
    'admin-accounts',
    (vars: { uid: string; isEnabled: boolean }) =>
      adminManagementRepository.setAccess(vars.uid, vars.isEnabled),
  )
