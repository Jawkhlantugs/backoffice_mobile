import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { InternalBalance } from '@/data/internal-transaction/internal-transaction-model'
import { useInternalBalances } from '@/hooks/use-internal-transactions'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function InternalBalanceListScreen() {
  const [search, setSearch] = useState('')
  const list = useInternalBalances(search)

  return (
    <PagedListScreen
      title={text.internalBalances.title}
      subtitle={text.internalBalances.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="wallet"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.id, amount: f.balance }}
    />
  )
}

/** Вэбийн `internal-transaction/balances/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.account,
  f.subAccountId,
  f.asset,
  'amount',
  f.updatedAt,
] as const

function toCard(item: InternalBalance): RecordView {
  return {
    title: item.owner ?? item.subAccountId,
    tableTitle: item.id,
    subtitle: item.subAccountId,
    amount: item.balance,
    fields: [
      { label: f.account, value: item.owner },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.asset, value: item.balance.currency },
    ],
    details: [{ label: f.updatedAt, value: formatDate(item.updatedAt) }],
    columns: COLUMNS,
  }
}
