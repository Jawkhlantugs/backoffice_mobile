import { useState } from 'react'
import { useRouter } from 'expo-router'

import { PagedListScreen, type RecordView } from '@/components'
import type { OperationAccountRow } from '@/data/admin-activity/admin-activity-model'
import { useOperationAccountRows } from '@/hooks/use-admin-activity'
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

function toCard(item: OperationAccountRow): RecordView {
  return {
    title: item.name,
    subtitle: item.subAccountId,
    fields: [
      { label: f.canTrade, value: item.canTrade ? text.yes : text.no },
      { label: f.canWithdraw, value: item.canWithdraw ? text.yes : text.no },
    ],
    details: [
      { label: f.binanceEmail, value: item.binanceEmail },
      { label: f.description, value: item.description },
    ],
  }
}
