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
    />
  )
}

function toCard(item: InternalBalance): RecordView {
  return {
    title: item.owner ?? item.subAccountId,
    subtitle: item.subAccountId,
    amount: item.balance,
    details: [{ label: f.updatedAt, value: formatDate(item.updatedAt) }],
  }
}
