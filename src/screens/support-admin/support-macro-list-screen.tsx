import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SupportMacro } from '@/data/support-admin/support-admin-model'
import { useSupportMacros } from '@/hooks/use-support-admin'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.supportAdmin
const f = text.fields

/** Вэбийн `support/macros/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.name,
  f.value,
  f.createdBy,
  'status',
  f.createdAt,
  f.updatedAt,
] as const

function toRecord(item: SupportMacro): RecordView {
  return {
    tableTitle: item.id,
    title: item.name,
    subtitle: item.description,
    status: activeStatus(item.isActive),
    fields: [
      { label: f.value, value: item.value },
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

/** Macro нэмэх/засах нь вэб дээр (rich text editor). */
export function SupportMacroListScreen() {
  const [search, setSearch] = useState('')
  const list = useSupportMacros(search)

  return (
    <PagedListScreen
      title={text.macros.title}
      subtitle={text.macros.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="chat"
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
