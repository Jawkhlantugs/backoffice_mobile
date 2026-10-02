import { QueryListScreen, type RecordView } from '@/components'
import type { AdminMenuGroup } from '@/data/admin-management/admin-management-model'
import { useAdminMenuGroups } from '@/hooks/use-admin-management'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.adminManagement
const f = text.fields

function toRecord(item: AdminMenuGroup): RecordView {
  return {
    title: item.name,
    subtitle: `${f.id} ${item.id}`,
    fields: [
      { label: f.id, value: item.id },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
  }
}

/** Бүлэг нэмэх/засах/устгах нь вэб дээр. */
export function AdminMenuGroupListScreen() {
  const query = useAdminMenuGroups()

  return (
    <QueryListScreen
      title={text.menuGroups.title}
      subtitle={text.menuGroups.subtitle}
      query={query}
      keyExtractor={(item) => item.id}
      emptyIcon="folder"
      searchText={(item) => `${item.name} ${item.id}`}
      searchPlaceholder={text.searchPlaceholder}
      tableLabels={{ title: f.name }}
      record={toRecord}
    />
  )
}
