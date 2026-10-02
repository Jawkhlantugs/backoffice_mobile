import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { InternalTransactionRecord } from '@/data/internal-transaction/internal-transaction-model'
import { useInternalTransactionRecords } from '@/hooks/use-internal-transactions'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

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
    />
  )
}

function toCard(item: InternalTransactionRecord): RecordView {
  return {
    title: item.to ?? item.txnId,
    subtitle: formatDate(item.createdAt),
    status: item.status
      ? { label: item.status, tone: statusTone(item.status) }
      : undefined,
    amount: item.amount,
    fields: [{ label: f.from, value: item.from }],
    details: [
      { label: f.to, value: item.to },
      { label: f.txnId, value: item.txnId },
      { label: f.clientOrderId, value: item.clientTranId },
    ],
  }
}
