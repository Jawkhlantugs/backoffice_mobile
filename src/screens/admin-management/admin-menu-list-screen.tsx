import { useState } from 'react'

import { QueryListScreen, type RecordView } from '@/components'
import type { AdminMenuRow } from '@/data/admin-management/admin-management-model'
import { TEAMS } from '@/core/navigation/menu-items'
import { useAdminMenus } from '@/hooks/use-admin-management'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.adminManagement
const f = text.fields
const ALL = 'all'
const INDENT = '  '

function toRecord(item: AdminMenuRow): RecordView {
  const prefix = item.depth > 0 ? `${INDENT.repeat(item.depth - 1)}↳ ` : ''
  return {
    title: `${prefix}${item.name}`,
    subtitle: item.path,
    fields: [
      { label: f.team, value: item.team },
      { label: f.order, value: item.order },
      { label: f.permission, value: item.permission },
      { label: f.children, value: item.childCount || undefined },
    ],
    details: [
      { label: f.parent, value: item.parent },
      { label: f.icon, value: item.icon },
      { label: f.id, value: item.id },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
  }
}

/** Бүх цэсний мод (вэбийн sidebar-ийн эх). Засах нь вэб дээр. */
export function AdminMenuListScreen() {
  const [team, setTeam] = useState<string>(ALL)
  const query = useAdminMenus()
  const data =
    team === ALL ? query.data : query.data?.filter((row) => row.team === team)

  return (
    <QueryListScreen
      title={text.menus.title}
      subtitle={text.menus.subtitle}
      query={{ ...query, data }}
      keyExtractor={(item) => item.id}
      emptyIcon="tree"
      searchText={(item) => `${item.name} ${item.path ?? ''}`}
      searchPlaceholder={text.searchPlaceholder}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...TEAMS.map((info) => ({ value: info.key, label: info.name })),
        ],
        value: team,
        onChange: setTeam,
      }}
      tableLabels={{ title: f.name }}
      record={toRecord}
    />
  )
}
