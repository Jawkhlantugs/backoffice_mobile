import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FuturesAccount } from '@/data/futures-account/futures-account-model'
import { useFuturesAccounts } from '@/hooks/use-futures-accounts'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function FuturesAccountListScreen() {
  const [search, setSearch] = useState('')
  const list = useFuturesAccounts(search)

  return (
    <PagedListScreen
      title={text.futuresAccounts.title}
      subtitle={text.futuresAccounts.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="users"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.userId }}
    />
  )
}

/** Вэбийн `futures/users/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.email,
  f.traderUserId,
  f.role,
  f.subAccountId,
  f.createdAt,
] as const

function toCard(item: FuturesAccount): RecordView {
  return {
    title: item.email,
    tableTitle: item.userId,
    subtitle: formatDate(item.createdAt),
    fields: [
      { label: f.role, value: item.role },
      { label: f.subAccountId, value: item.subAccountId },
    ],
    details: [
      { label: f.email, value: item.email },
      { label: f.user, value: item.userId },
      { label: f.traderUserId, value: item.traderUserId },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    columns: COLUMNS,
  }
}
