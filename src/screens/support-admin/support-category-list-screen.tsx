import { QueryListScreen, type RecordView } from '@/components'
import type { SupportCategory } from '@/data/support-admin/support-admin-model'
import { useSupportCategories } from '@/hooks/use-support-admin'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.supportAdmin
const f = text.fields

const typeLabel = (type: string | undefined) => {
  if (!type) return undefined
  const labels: Record<string, string> = text.categoryTypes
  return labels[type] ?? type
}

/** Вэбийн `support/ticket-category/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.nameMn,
  f.createdBy,
  f.parent,
  'status',
  f.createdAt,
  f.updatedAt,
] as const

function toRecord(item: SupportCategory): RecordView {
  return {
    tableTitle: item.nameEn || item.id,
    title: item.nameEn || item.nameMn || item.id,
    subtitle: item.parent ? `↳ ${item.parent}` : item.nameMn,
    status: activeStatus(item.isActive),
    fields: [
      { label: f.nameMn, value: item.nameMn },
      { label: f.type, value: typeLabel(item.type) },
      { label: f.parent, value: item.parent },
      { label: f.createdBy, value: item.createdBy },
    ],
    details: [
      { label: f.tickets, value: item.ticketsCount },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    columns: COLUMNS,
  }
}

/** Ангилал нэмэх/засах (зураг, заавар) нь вэб дээр. */
export function SupportCategoryListScreen() {
  const query = useSupportCategories()

  return (
    <QueryListScreen
      title={text.categories.title}
      subtitle={text.categories.subtitle}
      query={query}
      keyExtractor={(item) => item.id}
      emptyIcon="tags"
      searchText={(item) => `${item.nameEn} ${item.nameMn}`}
      searchPlaceholder={text.searchPlaceholder}
      tableLabels={{ title: f.nameEn, status: f.active }}
      record={toRecord}
    />
  )
}
