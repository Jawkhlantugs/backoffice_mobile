import { useState } from 'react'
import { useRouter } from 'expo-router'

import { PagedListScreen, type RecordView } from '@/components'
import type { OperationAccountRow } from '@/data/admin-activity/admin-activity-model'
import { useOperationAccountRows } from '@/hooks/use-admin-activity'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function OperationAccountListScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const list = useOperationAccountRows(search)

  return (
    <PagedListScreen
      title={text.operationAccounts.title}
      subtitle={text.operationAccounts.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="admin"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={(item) => ({
        ...toCard(item),
        onPress: () =>
          router.push({
            pathname: '/admin/operation-accounts/[subAccountId]',
            params: { subAccountId: item.subAccountId },
          }),
      })}
    />
  )
}

/** Вэбийн `user-management/operation-accounts/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.name,
  f.binanceEmail,
  f.subAccountId,
  f.canTrade,
  f.canWithdraw,
  f.description,
  f.createdAt,
] as const

/** Вэб зөвшөөрлийг ногоон Yes / улаан No Badge-аар харуулдаг. */
const allowed = (label: string, value: boolean) => ({
  label,
  value: value ? 'Yes' : 'No',
  tone: value ? ('success' as const) : ('danger' as const),
})

function toCard(item: OperationAccountRow): RecordView {
  return {
    title: item.name,
    tableTitle: item.id,
    subtitle: item.subAccountId,
    fields: [
      allowed(f.canTrade, item.canTrade),
      allowed(f.canWithdraw, item.canWithdraw),
      { label: f.binanceEmail, value: item.binanceEmail },
      { label: f.subAccountId, value: item.subAccountId },
    ],
    details: [
      { label: f.name, value: item.name },
      { label: f.description, value: item.description },
      {
        label: f.createdAt,
        value: item.createdAt ? formatDate(item.createdAt) : undefined,
      },
    ],
    columns: COLUMNS,
  }
}
