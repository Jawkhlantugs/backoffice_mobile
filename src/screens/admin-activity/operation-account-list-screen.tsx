import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
import type { OperationAccountRow } from '@/data/admin-activity/admin-activity-model'
import { useOperationAccountRows } from '@/hooks/use-admin-activity'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function OperationAccountListScreen() {
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
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(
  item: OperationAccountRow,
): React.ComponentProps<typeof RecordCard> {
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
