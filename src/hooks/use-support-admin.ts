import { useQuery } from '@tanstack/react-query'

import { supportAdminRepository } from '@/data/support-admin/support-admin-repository'

import { usePagedList } from './use-paged-list'

export const useSupportMacros = (search: string) =>
  usePagedList('support-macros', supportAdminRepository.macros, { search })
export const useSupportAgents = (search: string) =>
  usePagedList('support-agents', supportAdminRepository.agents, { search })
export const useSupportRoles = (search: string) =>
  usePagedList('support-roles', supportAdminRepository.roles, { search })
export const useSupportTeams = (search: string) =>
  usePagedList('support-teams', supportAdminRepository.teams, { search })
export const useSupportCategories = () =>
  useQuery({
    queryKey: ['support-categories'],
    queryFn: supportAdminRepository.categories,
  })
