import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { InternalTransaction } from '@/data/internal-transaction/internal-transaction-model'
import { useInternalTransactions } from '@/hooks/use-internal-transactions'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function InternalTransactionListScreen() {
  const [search, setSearch] = useState('')
  const list = useInternalTransactions(search)

  return (
    <PagedListScreen
      title={text.internalTransactions.title}
      subtitle={text.internalTransactions.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="transfer"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: InternalTransaction): RecordView {
  return {
    title: item.to ?? item.txnId,
    subtitle: formatDate(item.createdAt),
    amount: item.amount,
    fields: [
      { label: f.from, value: item.from },
      { label: f.code, value: item.code },
    ],
    details: [
      { label: f.to, value: item.to },
      { label: f.txnId, value: item.txnId },
      { label: f.binanceTxnId, value: item.binanceTxnId },
    ],
  }
}
