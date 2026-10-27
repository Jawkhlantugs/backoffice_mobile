import { PagedListScreen, type RecordView } from '@/components'
import type { FooterCategory } from '@/data/site-content/site-content-model'
import { useFooterCategories } from '@/hooks/use-site-content'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.siteContent
const f = text.fields

/** Вэбийн `footer-menu/category/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [f.nameEn, 'status'] as const

function toRecord(item: FooterCategory): RecordView {
  return {
    title: item.nameMn || item.nameEn || item.id,
    subtitle: item.nameEn,
    status: activeStatus(item.isActive, 'neutral'),
    fields: [
      { label: f.nameEn, value: item.nameEn },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    columns: COLUMNS,
  }
}

export function FooterCategoryListScreen() {
  const list = useFooterCategories()

  return (
    <PagedListScreen
      title={text.footerCategories.title}
      subtitle={text.footerCategories.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="folder"
      tableLabels={{ title: f.nameMn }}
      record={toRecord}
    />
  )
}
