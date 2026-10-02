import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SupportTeam } from '@/data/support-admin/support-admin-model'
import { useSupportTeams } from '@/hooks/use-support-admin'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.supportAdmin
const f = text.fields

function toRecord(item: SupportTeam): RecordView {
  return {
    title: item.name,
    subtitle: item.description,
    status: activeStatus(item.isActive),
    fields: [
      { label: f.tickets, value: item.ticketsCount },
      { label: f.createdBy, value: item.createdBy },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    details: [{ label: f.description, value: item.description }],
  }
}

export function SupportTeamListScreen() {
  const [search, setSearch] = useState('')
  const list = useSupportTeams(search)

  return (
    <PagedListScreen
      title={text.teams.title}
      subtitle={text.teams.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="users"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      tableLabels={{ title: f.name }}
      record={toRecord}
    />
  )
}
