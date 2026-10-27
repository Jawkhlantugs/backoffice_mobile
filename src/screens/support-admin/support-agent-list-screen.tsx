import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SupportAgent } from '@/data/support-admin/support-admin-model'
import { useSupportAgents } from '@/hooks/use-support-admin'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.supportAdmin
const f = text.fields

/** Вэбийн `support/support-user/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.email,
  f.name,
  f.createdBy,
  f.role,
  f.team,
  'status',
  f.createdAt,
  f.updatedAt,
] as const

function toRecord(item: SupportAgent): RecordView {
  return {
    tableTitle: item.id,
    title: item.name || item.email || item.id,
    subtitle: item.email,
    status: activeStatus(item.isActive),
    fields: [
      { label: f.role, value: item.role },
      { label: f.team, value: item.team },
      { label: f.createdBy, value: item.createdBy },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    details: [
      { label: f.email, value: item.email },
      { label: f.name, value: item.name },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    columns: COLUMNS,
  }
}

export function SupportAgentListScreen() {
  const [search, setSearch] = useState('')
  const list = useSupportAgents(search)

  return (
    <PagedListScreen
      title={text.agents.title}
      subtitle={text.agents.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="users"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      tableLabels={{ title: f.id, status: f.active }}
      record={toRecord}
    />
  )
}
