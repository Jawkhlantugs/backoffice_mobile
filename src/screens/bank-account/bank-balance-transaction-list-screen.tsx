import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { BalanceTransaction } from '@/data/bank-account/bank-account-model'
import { useBalanceTransactions } from '@/hooks/use-bank-accounts'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function BankBalanceTransactionListScreen() {
  const [search, setSearch] = useState('')
  const list = useBalanceTransactions(search)

  return (
    <PagedListScreen
      title={text.bankBalanceTransactions.title}
      subtitle={text.bankBalanceTransactions.subtitle}
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

function toCard(item: BalanceTransaction): RecordView {
  return {
    title: item.owner ?? item.subAccountId,
    subtitle: [item.type, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    status: {
      label: item.isCredit ? f.credit : f.debit,
      tone: item.isCredit ? 'success' : 'danger',
    },
    amount: item.isCredit ? item.credit : item.debit,
    fields: [
      { label: f.before, amount: item.before },
      { label: f.after, amount: item.after },
    ],
    details: [
      { label: f.txnId, value: item.txnId },
      { label: f.subAccountId, value: item.subAccountId },
    ],
  }
}
