import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
import type { ExchangeBankWallet } from '@/data/bank-account/bank-account-model'
import { useExchangeBankWallets } from '@/hooks/use-bank-accounts'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

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
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(
  item: ExchangeBankWallet,
): React.ComponentProps<typeof RecordCard> {
  return {
    title: item.accountName ?? item.accountNumber ?? item.id,
    subtitle: [item.bankCode, item.accountNumber].filter(Boolean).join(' · '),
    status: item.status
      ? { label: item.status, tone: statusTone(item.status) }
      : undefined,
    amount: item.balance,
    fields: [
      { label: f.usage, value: item.usage },
      { label: f.order, value: item.order },
    ],
    details: [{ label: f.iban, value: item.iban }],
  }
}
