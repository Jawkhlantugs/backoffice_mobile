/**
 * `/admin/admin-menus/my`-ийн хариу. Вэб админы sidebar яг эдгээр талбарыг
 * уншдаг (`components/layout/app-sidebar.tsx`) — mobile-ийн цэс түүнтэй
 * ижил бүтэцтэй байхын тулд ижил өгөгдлөөс үүснэ.
 */

export type AdminMenuGroup = { id: string; name: string }

export type AdminMenuNode = {
  id: string
  name: string
  path?: string
  /** Вэбийн sidebar-ийн lucide дүрсний нэр — mobile түүнийг өөрийн
   * дүрс рүү хөрвүүлнэ (`core/navigation/menu-icons.ts`). */
  icon?: string
  /** Вэбийн баг сонгогч: portal · office · partner · futures. */
  team: string
  groupId?: string
  order: number
  children: AdminMenuNode[]
}

export type AdminMenuTree = {
  groups: AdminMenuGroup[]
  items: AdminMenuNode[]
}

type MenuDto = {
  id?: string
  name?: string
  path?: string
  icon?: string
  team?: string
  groupId?: string | null
  order?: number
  children?: MenuDto[]
}

type GroupDto = { id?: string; name?: string }

/** Вэбтэй ижил: `team` хоосон бол portal гэж үзнэ. */
const DEFAULT_TEAM = 'portal'

function toNode(dto: MenuDto): AdminMenuNode {
  return {
    id: dto.id ?? dto.path ?? dto.name ?? '',
    name: dto.name ?? '',
    path: dto.path ?? undefined,
    icon: dto.icon ?? undefined,
    team: dto.team || DEFAULT_TEAM,
    groupId: dto.groupId ?? undefined,
    order: typeof dto.order === 'number' ? dto.order : 0,
    children: Array.isArray(dto.children) ? dto.children.map(toNode) : [],
  }
}

function readArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

/**
 * Хариу нь заримдаа шууд массив (`AdminMenu[]`), заримдаа
 * `{ menus, groups }` — хоёуланг барина.
 */
export function toMenuTree(payload: unknown): AdminMenuTree {
  if (Array.isArray(payload)) {
    return { groups: [], items: payload.map(toNode) }
  }

  if (typeof payload !== 'object' || payload === null) {
    return { groups: [], items: [] }
  }

  const bag = payload as { menus?: unknown; groups?: unknown }

  return {
    groups: readArray<GroupDto>(bag.groups)
      .filter((group) => Boolean(group.id))
      .map((group) => ({ id: group.id ?? '', name: group.name ?? '' })),
    items: readArray<MenuDto>(bag.menus).map(toNode),
  }
}
