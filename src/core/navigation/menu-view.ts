import type { Href } from 'expo-router'

import type { AdminMenuNode, AdminMenuTree } from '@/data/auth/admin-menu-dto'
import type { AppIconName } from '@/components/app-icon'

import { iconForMenu } from './menu-icons'
import { routeForMenu } from './menu-items'

export type MenuEntry = {
  id: string
  label: string
  path?: string
  /** `null` бол mobile дээр хараахан хийгдээгүй (§1.7). */
  route: Href | null
  icon: AppIconName
  children: MenuEntry[]
}

export type MenuGroup = {
  id: string
  title: string
  entries: MenuEntry[]
}

export type MenuView = {
  groups: MenuGroup[]
  /** Нийт мөр (дэд мөр орно) ба тэдгээрээс утсан дээр нээгддэг нь. */
  total: number
  ready: number
}

function toEntry(node: AdminMenuNode): MenuEntry {
  return {
    id: node.id,
    label: node.name,
    path: node.path,
    route: routeForMenu(node.path),
    icon: iconForMenu(node.icon, node.path),
    children: node.children.map(toEntry),
  }
}

function countEntries(entries: MenuEntry[]): { total: number; ready: number } {
  return entries.reduce(
    (sum, entry) => {
      const child = countEntries(entry.children)
      const self = entry.children.length === 0 ? 1 : 0
      const selfReady = self === 1 && entry.route !== null ? 1 : 0

      return {
        total: sum.total + self + child.total,
        ready: sum.ready + selfReady + child.ready,
      }
    },
    { total: 0, ready: 0 },
  )
}

/** Хайлтын текстээр шүүх — эцэг мөр таарвал хүүхдүүд нь хэвээр үлдэнэ. */
function filterEntries(entries: MenuEntry[], query: string): MenuEntry[] {
  if (query.length === 0) return entries

  const needle = query.toLowerCase()

  return entries.flatMap((entry) => {
    if (entry.label.toLowerCase().includes(needle)) return [entry]

    const children = filterEntries(entry.children, query)
    return children.length > 0 ? [{ ...entry, children }] : []
  })
}

/**
 * Вэбийн sidebar-тай ижил дараалал: тухайн багийн цэсийг бүлгээр нь, бүлэггүй
 * мөрийг сүүлд. `app-sidebar.tsx` яг ийм дарааллаар угсардаг.
 */
export function buildMenu(
  tree: AdminMenuTree,
  team: string,
  options: { query?: string; ungroupedTitle: string },
): MenuView {
  const query = (options.query ?? '').trim()

  const teamMenus = tree.items
    .filter((item) => item.team === team)
    .sort((left, right) => left.order - right.order)

  const grouped: MenuGroup[] = tree.groups
    .map((group) => ({
      id: group.id,
      title: group.name,
      entries: filterEntries(
        teamMenus.filter((menu) => menu.groupId === group.id).map(toEntry),
        query,
      ),
    }))
    .filter((group) => group.entries.length > 0)

  const ungrouped = filterEntries(
    teamMenus.filter((menu) => !menu.groupId).map(toEntry),
    query,
  )

  const groups =
    ungrouped.length > 0
      ? [
          ...grouped,
          { id: 'ungrouped', title: options.ungroupedTitle, entries: ungrouped },
        ]
      : grouped

  const counts = countEntries(groups.flatMap((group) => group.entries))

  return { groups, total: counts.total, ready: counts.ready }
}

/** Баг тус бүрт хэдэн цэс байгаа — багийн сонгогч дээр харуулна. */
export function countByTeam(tree: AdminMenuTree): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const item of tree.items) {
    counts[item.team] = (counts[item.team] ?? 0) + 1
  }

  return counts
}

/** Тухайн зам админы цэсэнд байгаа эсэх — эрхгүй бол дэлгэц үзүүлэхгүй. */
export function hasMenuPath(tree: AdminMenuTree, path: string): boolean {
  function search(nodes: AdminMenuNode[]): boolean {
    return nodes.some(
      (node) => node.path === path || search(node.children),
    )
  }

  return search(tree.items)
}
