import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  SITE_STATUSES,
  type NewsArticle,
} from '@/data/site-content/site-content-model'
import { useNews } from '@/hooks/use-site-content'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.siteContent
const f = text.fields
const ALL = 'all'

function toRecord(item: NewsArticle): RecordView {
  return {
    title: item.nameMn || item.nameEn || item.id,
    subtitle: item.nameEn,
    status: activeStatus(item.status === 'active'),
    image: item.imageUrl,
    fields: [
      { label: f.category, value: labelOf(text.newsCategories, item.category) },
      { label: f.views, value: item.views },
      {
        label: f.publishedAt,
        value: item.publishedAt ? formatDate(item.publishedAt) : undefined,
      },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    details: [{ label: f.likes, value: item.likes }],
  }
}

/** Мэдээ бичих/засах (rich text, зураг) нь вэб дээр. */
export function NewsListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = useNews(search, status === ALL ? undefined : status)

  return (
    <PagedListScreen
      title={text.news.title}
      subtitle={text.news.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="news"
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
