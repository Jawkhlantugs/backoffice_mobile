import { useState } from 'react'

import { PagedListScreen, type RecordView, type StatusTone } from '@/components'
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
      record={toCard}
      tableLabels={{ title: f.time }}
    />
  )
}

/** Вэбийн `activity-log/columns.tsx`-ийн `variantMap`. */
const ACTION_TONE: Record<string, StatusTone> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
  EXPORT: 'danger',
}

/**
 * Вэбийн `admin-management/activity-log/components/columns.tsx`-ийн дараалал.
 * Params (requestBody) нууц утгатай байж болох тул mobile-д харуулахгүй.
 */
const COLUMNS = [
  f.admin,
  f.action,
  f.method,
  f.path,
  'status',
  f.records,
  f.duration,
  f.ip,
] as const

function toCard(item: AdminActivity): RecordView {
  return {
    title: `${item.method} ${item.path}`,
    tableTitle: formatDate(item.createdAt),
    subtitle: [item.admin, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    // Вэб: 200 → ногоон, бусад нь улаан.
    status: {
      label: String(item.statusCode),
      tone: item.statusCode === 200 ? 'success' : 'danger',
    },
    fields: [
      {
        label: f.action,
        value: item.action,
        tone: ACTION_TONE[item.action] ?? 'neutral',
      },
      {
        label: f.method,
        value: item.method,
        tone: item.method === 'DELETE' ? 'danger' : 'neutral',
      },
      { label: f.records, value: item.recordCount },
      { label: f.duration, value: `${item.durationMs}ms` },
    ],
    details: [
      { label: f.admin, value: item.admin },
      { label: f.path, value: item.path },
      { label: f.ip, value: item.ip },
    ],
    columns: COLUMNS,
  }
}
