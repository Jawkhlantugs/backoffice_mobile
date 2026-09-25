import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
import type { AdminActivity } from '@/data/admin-activity/admin-activity-model'
import { useAdminActivities } from '@/hooks/use-admin-activity'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function AdminActivityListScreen() {
  const [search, setSearch] = useState('')
  const list = useAdminActivities(search)

  return (
    <PagedListScreen
      title={text.adminActivity.title}
      subtitle={text.adminActivity.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="history"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(item: AdminActivity): React.ComponentProps<typeof RecordCard> {
  return {
    title: `${item.method} ${item.path}`,
    subtitle: [item.admin, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    status: {
      label: String(item.statusCode),
      tone: item.isError ? 'danger' : 'success',
    },
    fields: [
      { label: f.action, value: item.action },
      { label: f.records, value: item.recordCount },
    ],
    details: [
      { label: f.admin, value: item.admin },
      { label: f.ip, value: item.ip },
      { label: f.duration, value: `${item.durationMs}ms` },
    ],
  }
}
