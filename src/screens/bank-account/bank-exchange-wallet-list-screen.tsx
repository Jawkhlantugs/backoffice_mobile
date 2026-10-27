import { useState } from 'react'

import { PagedListScreen, type RecordView, type StatusTone } from '@/components'
import type { ExchangeBankWallet } from '@/data/bank-account/bank-account-model'
import { useExchangeBankWallets } from '@/hooks/use-bank-accounts'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function BankExchangeWalletListScreen() {
  const [search, setSearch] = useState('')
  const list = useExchangeBankWallets(search)

  return (
    <PagedListScreen
      title={text.bankExchangeWallets.title}
      subtitle={text.bankExchangeWallets.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="bank"
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

/** Вэбийн `exchange-wallets/constants.ts`-ийн `getStatusVariant`. */
function statusToneOf(status: string): StatusTone {
  if (status === 'ACTIVE') return 'success'
  if (status === 'INACTIVE') return 'danger'
  return 'warning'
}

/** Вэбийн `bank/exchange-wallets/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.accountName,
  f.accountNumber,
  f.bank,
  'amount',
  f.currency,
  'status',
  f.usage,
  f.iban,
  f.createdAt,
] as const

function toCard(item: ExchangeBankWallet): RecordView {
  return {
    title: item.accountName ?? item.accountNumber ?? item.id,
    tableTitle: item.id,
    subtitle: [item.bankCode, item.accountNumber].filter(Boolean).join(' · '),
    status: item.status
      ? { label: item.status, tone: statusToneOf(item.status) }
      : undefined,
    amount: item.balance && { ...item.balance, showCode: true },
    fields: [
      { label: f.usage, value: item.usage },
      { label: f.bank, value: item.bankCode },
      { label: f.accountName, value: item.accountName },
      { label: f.accountNumber, value: item.accountNumber },
    ],
    details: [
      { label: f.currency, value: item.currency },
      { label: f.iban, value: item.iban },
      { label: f.order, value: item.order },
      {
        label: f.createdAt,
        value: item.createdAt ? formatDate(item.createdAt) : undefined,
      },
    ],
    columns: COLUMNS,
  }
}
