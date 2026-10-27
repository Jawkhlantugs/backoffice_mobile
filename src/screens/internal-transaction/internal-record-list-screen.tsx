import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { InternalTransactionRecord } from '@/data/internal-transaction/internal-transaction-model'
import { useInternalTransactionRecords } from '@/hooks/use-internal-transactions'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function InternalRecordListScreen() {
  const [search, setSearch] = useState('')
  const list = useInternalTransactionRecords(search)

  return (
    <PagedListScreen
      title={text.internalRecords.title}
      subtitle={text.internalRecords.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="transaction"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.txnId }}
    />
  )
}

/** Вэбийн `transaction-records/constants.ts`: FAILED улаан, бусад өнгөгүй. */
const statusToneOf = (status: string) =>
  status === 'FAILED' ? ('danger' as const) : ('neutral' as const)

/** Вэбийн `internal-transaction/transaction-records/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.asset,
  'amount',
  'status',
  f.from,
  f.to,
  f.createdAt,
] as const

function toCard(item: InternalTransactionRecord): RecordView {
  return {
    title: item.to ?? item.txnId,
    tableTitle: item.txnId,
    subtitle: formatDate(item.createdAt),
    status: item.status
      ? { label: item.status, tone: statusToneOf(item.status) }
      : undefined,
    amount: item.amount,
    fields: [
      { label: f.from, value: item.from },
      { label: f.asset, value: item.amount?.currency },
    ],
    details: [
      { label: f.to, value: item.to },
      { label: f.txnId, value: item.txnId },
      { label: f.clientOrderId, value: item.clientTranId },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    columns: COLUMNS,
  }
}
