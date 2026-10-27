import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SupportRole } from '@/data/support-admin/support-admin-model'
import { useSupportRoles } from '@/hooks/use-support-admin'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.supportAdmin
const f = text.fields

/** Вэбийн `support/support-user-roles/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.name,
  f.description,
  'status',
  f.createdBy,
  f.createdAt,
  f.updatedAt,
] as const

function toRecord(item: SupportRole): RecordView {
  return {
    tableTitle: item.id,
    title: item.name,
    subtitle: item.description,
    status: activeStatus(item.isActive),
    fields: [
      { label: f.categories, value: item.categoryCount },
      { label: f.createdBy, value: item.createdBy },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    details: [
      { label: f.name, value: item.name },
      { label: f.description, value: item.description },
    ],
    columns: COLUMNS,
  }
}

export function SupportRoleListScreen() {
  const [search, setSearch] = useState('')
  const list = useSupportRoles(search)

  return (
    <PagedListScreen
      title={text.roles.title}
      subtitle={text.roles.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="shield"
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
