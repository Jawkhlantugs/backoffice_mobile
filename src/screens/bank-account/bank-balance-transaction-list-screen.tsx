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
      tableLabels={{ title: f.date }}
    />
  )
}

/** Вэбийн `bank/balance-transactions/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.subAccountId,
  f.asset,
  f.type,
  f.before,
  f.after,
  f.credit,
  f.debit,
  f.txnId,
] as const

/** Вэб кредитийг ногоон, дебитийг улаан текстээр; 0 бол зураас. */
function toCard(item: BalanceTransaction): RecordView {
  return {
    title: item.owner ?? item.subAccountId,
    tableTitle: formatDate(item.createdAt),
    subtitle: [item.type, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    // Картад л — вэбийн хүснэгтэд статус, нэгдсэн дүн багана байхгүй.
    status: {
      label: item.isCredit ? f.credit : f.debit,
      tone: item.isCredit ? 'success' : 'danger',
    },
    amount: item.isCredit ? item.credit : item.debit,
    fields: [
      {
        label: f.credit,
        amount: item.isCredit ? item.credit : undefined,
        tone: 'success',
      },
      {
        label: f.debit,
        amount: item.isCredit ? undefined : item.debit,
        tone: 'danger',
      },
      { label: f.before, amount: item.before },
      { label: f.after, amount: item.after },
    ],
    details: [
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.asset, value: item.asset },
      { label: f.type, value: item.type },
      { label: f.txnId, value: item.txnId },
    ],
    columns: COLUMNS,
  }
}
