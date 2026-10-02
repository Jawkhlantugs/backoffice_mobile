import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SupportMacro } from '@/data/support-admin/support-admin-model'
import { useSupportMacros } from '@/hooks/use-support-admin'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.supportAdmin
const f = text.fields

function toRecord(item: SupportMacro): RecordView {
  return {
    title: item.name,
    subtitle: item.description,
    status: activeStatus(item.isActive),
    fields: [
      { label: f.value, value: item.value },
      { label: f.createdBy, value: item.createdBy },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    details: [{ label: f.description, value: item.description }],
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
      tableLabels={{ title: f.name }}
      record={toRecord}
    />
  )
}
