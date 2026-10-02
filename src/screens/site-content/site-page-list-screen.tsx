import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  SITE_STATUSES,
  type SitePage,
} from '@/data/site-content/site-content-model'
import { useSitePages } from '@/hooks/use-site-content'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.siteContent
const f = text.fields
const ALL = 'all'

const statusChips = () => [
  { value: ALL, label: messages.common.all },
  ...SITE_STATUSES.map((value) => ({
    value,
    label: activeStatus(value === 'active').label,
  })),
]

function toRecord(item: SitePage): RecordView {
  return {
    title: item.nameMn || item.nameEn || item.id,
    subtitle: item.nameEn,
    status: activeStatus(item.status === 'active'),
    fields: [
      { label: f.type, value: item.type },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    details: [
      { label: f.short, value: item.shortMn },
      { label: f.file, value: item.fileUrl },
    ],
  }
}

/** Хуудасны агуулга (markdown, файл) засах нь вэб дээр. */
export function SitePageListScreen() {
  const [status, setStatus] = useState<string>(ALL)
  const list = useSitePages(status === ALL ? undefined : status)

  return (
    <PagedListScreen
      title={text.pages.title}
      subtitle={text.pages.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="news"
      statusChips={{ chips: statusChips(), value: status, onChange: setStatus }}
      tableLabels={{ title: f.nameMn }}
      record={toRecord}
    />
  )
}
