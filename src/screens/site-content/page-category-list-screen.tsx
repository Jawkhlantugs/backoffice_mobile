import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  SITE_STATUSES,
  type PageCategory,
} from '@/data/site-content/site-content-model'
import { usePageCategories } from '@/hooks/use-site-content'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.siteContent
const f = text.fields
const ALL = 'all'

function toRecord(item: PageCategory): RecordView {
  return {
    title: item.nameMn || item.nameEn || item.id,
    subtitle: item.nameEn,
    status: activeStatus(item.status === 'active'),
    fields: [
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    details: [{ label: f.description, value: item.descriptionMn }],
  }
}

export function PageCategoryListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = usePageCategories(search, status === ALL ? undefined : status)

  return (
    <PagedListScreen
      title={text.pageCategories.title}
      subtitle={text.pageCategories.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="folder"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...SITE_STATUSES.map((value) => ({
            value,
            label: activeStatus(value === 'active').label,
          })),
        ],
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.nameMn }}
      record={toRecord}
    />
  )
}
