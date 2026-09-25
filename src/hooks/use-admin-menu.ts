import { useSessionStore } from '@/core/session/session-store'
import {
  DEFAULT_TEAM_KEY,
  TEAMS,
  teamInfo,
  type TeamInfo,
} from '@/core/navigation/menu-items'
import { useTeamStore } from '@/core/navigation/team-store'
import {
  buildMenu,
  countByTeam,
  type MenuView,
} from '@/core/navigation/menu-view'
import type { AdminMenuTree } from '@/data/auth/admin-menu-dto'
import { messages } from '@/lib/messages'

const EMPTY_TREE: AdminMenuTree = { groups: [], items: [] }

export type TeamOption = TeamInfo & {
  /** Тухайн багт админд нээгдсэн цэсний тоо. 0 бол эрх байхгүй. */
  count: number
}

export type AdminMenuState = MenuView & {
  teams: TeamOption[]
  activeTeam: string
  activeTeamInfo: TeamOption
  selectTeam: (team: string) => void
}

/**
 * Drawer ба Цэс таб хоёулаа үүнийг уншина — цэс хоёр газар өөрөөр
 * угсрахаас сэргийлнэ.
 *
 * Баг нь вэбтэй ижил **дөрвүүлээ үргэлж** жагсаана (`TEAMS`). Эрхгүй баг
 * нуугдахгүй, тоо нь 0 гэж харагдана — ажилтан вэб дээрээ юу харж байгаагаа
 * утсан дээрээ ч хардаг.
 */
export function useAdminMenu(query = ''): AdminMenuState {
  const tree = useSessionStore((store) => store.user?.menu) ?? EMPTY_TREE
  const selected = useTeamStore((store) => store.selected)
  const selectTeam = useTeamStore((store) => store.select)

  const counts = countByTeam(tree)
  const teams: TeamOption[] = TEAMS.map((team) => ({
    ...team,
    count: counts[team.key] ?? 0,
  }))

  // Сонгоогүй үед цэстэй эхний багийг нээнэ — хоосон drawer гарч ирэхгүй.
  const firstWithMenus = teams.find((team) => team.count > 0)
  const activeTeam = selected ?? firstWithMenus?.key ?? DEFAULT_TEAM_KEY
  const activeTeamInfo = teams.find((team) => team.key === activeTeam) ?? {
    ...teamInfo(activeTeam),
    count: counts[activeTeam] ?? 0,
  }

  const view = buildMenu(tree, activeTeam, {
    query,
    ungroupedTitle: messages.nav.ungrouped,
  })

  return { ...view, teams, activeTeam, activeTeamInfo, selectTeam }
}
