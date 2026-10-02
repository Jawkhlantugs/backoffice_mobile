import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { UserBankWallet } from '@/data/bank-account/bank-account-model'
import { useUserBankWallets } from '@/hooks/use-bank-accounts'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields

export function BankWalletListScreen() {
  const [search, setSearch] = useState('')
  const list = useUserBankWallets(search)

  return (
    <PagedListScreen
      title={text.bankWallets.title}
      subtitle={text.bankWallets.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="bank"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: UserBankWallet): RecordView {
  return {
    title: item.owner ?? item.accountName ?? item.id,
    subtitle: [item.bankName, item.accountNumber].filter(Boolean).join(' · '),
    status: item.status
      ? { label: item.status, tone: statusTone(item.status) }
      : undefined,
    fields: [
      { label: f.accountName, value: item.accountName },
      { label: f.iban, value: item.iban },
    ],
    details: [
      { label: f.code, value: item.walletCode },
      {
        label: f.verifiedAt,
        value: item.verifiedAt ? formatDate(item.verifiedAt) : undefined,
      },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
  }
}
