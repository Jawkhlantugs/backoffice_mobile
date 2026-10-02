import { stripHtml } from '@/lib/html'

import type {
  SupportAgent,
  SupportCategory,
  SupportMacro,
  SupportRole,
  SupportTeam,
} from './support-admin-model'

/**
 * Support endpoint-ууд camelCase, snake_case хоёуланг буцаадаг (вэбийн
 * `normalize*` функцууд яг үүнийг барьдаг) тул хоёуланг нь уншина.
 */
type AuditDto = {
  id?: string | number
  ID?: string | number
  is_active?: boolean
  isActive?: boolean
  create_user?: string
  createUser?: string
  adminUser?: { email?: string } | null
  admin_user?: { email?: string } | null
  created_at?: string
  createdAt?: string
  updated_at?: string
  updatedAt?: string
}

type Named = { name?: string } | null | undefined

export type SupportMacroDto = AuditDto & {
  name?: string
  description?: string
  value?: string
}

export type SupportAgentDto = AuditDto & {
  user_id?: string
  userId?: string
  user?: { email?: string } | null
  name?: string
  role?: string
  team?: string
  supportRole?: Named
  support_role?: Named
  supportTeam?: Named
  support_team?: Named
}

export type SupportRoleDto = AuditDto & {
  name?: string
  description?: string
  category_ids?: string[]
  categoryIds?: string[]
}

export type SupportTeamDto = AuditDto & {
  name?: string
  description?: string
  ticketsCount?: number
  tickets_count?: number
}

type CategoryNameDto = {
  category_name_en?: string
  categoryNameEn?: string
  category_name_mn?: string
  categoryNameMn?: string
}

export type SupportCategoryDto = AuditDto &
  CategoryNameDto & {
    type?: string
    parent?: CategoryNameDto | null
    parent_id?: string | null
    parentId?: string | null
    ticketsCount?: number
    tickets_count?: number
    children?: SupportCategoryDto[] | null
  }

function audit(dto: AuditDto) {
  return {
    id: String(dto.id ?? dto.ID ?? ''),
    isActive: dto.is_active ?? dto.isActive ?? true,
    createdBy:
      dto.adminUser?.email ??
      dto.admin_user?.email ??
      (dto.create_user || dto.createUser || undefined),
    createdAt: dto.created_at ?? dto.createdAt ?? '',
    updatedAt: dto.updated_at ?? dto.updatedAt ?? '',
  }
}

export function toSupportMacro(dto: SupportMacroDto): SupportMacro {
  return {
    ...audit(dto),
    name: dto.name ?? '',
    description: dto.description || undefined,
    value: stripHtml(dto.value ?? ''),
  }
}

export function toSupportAgent(dto: SupportAgentDto): SupportAgent {
  return {
    ...audit(dto),
    email: dto.user?.email ?? (dto.user_id || dto.userId || undefined),
    name: dto.name ?? '',
    role:
      dto.supportRole?.name ??
      dto.support_role?.name ??
      (dto.role || undefined),
    team:
      dto.supportTeam?.name ??
      dto.support_team?.name ??
      (dto.team || undefined),
  }
}

export function toSupportRole(dto: SupportRoleDto): SupportRole {
  return {
    ...audit(dto),
    name: dto.name ?? '',
    description: dto.description || undefined,
    categoryCount: (dto.category_ids ?? dto.categoryIds ?? []).length,
  }
}

export function toSupportTeam(dto: SupportTeamDto): SupportTeam {
  return {
    ...audit(dto),
    name: dto.name ?? '',
    description: dto.description || undefined,
    ticketsCount: dto.ticketsCount ?? dto.tickets_count,
  }
}

const nameEn = (dto: CategoryNameDto) =>
  dto.category_name_en ?? dto.categoryNameEn ?? ''
const nameMn = (dto: CategoryNameDto) =>
  dto.category_name_mn ?? dto.categoryNameMn ?? ''

function toCategory(
  dto: SupportCategoryDto,
  parent: string | undefined,
): SupportCategory {
  const parentName =
    parent ??
    (dto.parent ? nameEn(dto.parent) || nameMn(dto.parent) : undefined) ??
    (dto.parent_id || dto.parentId || undefined)
  return {
    ...audit(dto),
    nameEn: nameEn(dto),
    nameMn: nameMn(dto),
    type: dto.type ? dto.type.trim().toLowerCase() : undefined,
    parent: parentName || undefined,
    ticketsCount: dto.ticketsCount ?? dto.tickets_count,
  }
}

/** Вэб шиг эцэг → дэд ангиллыг дараалан нэг жагсаалт болгоно. */
export function flattenSupportCategories(
  roots: readonly SupportCategoryDto[],
): SupportCategory[] {
  return roots.flatMap((root) => {
    const parent = toCategory(root, undefined)
    const children = (root.children ?? []).map((child) =>
      toCategory(child, parent.nameEn || parent.nameMn),
    )
    return [parent, ...children]
  })
}
