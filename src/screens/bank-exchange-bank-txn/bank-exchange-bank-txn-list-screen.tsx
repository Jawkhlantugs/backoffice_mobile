import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useBankExchangeBankTxns } from '@/hooks/use-bank-exchange-bank-txn'
import { messages } from '@/lib/messages'

import { BankExchangeBankTxnCard } from './bank-exchange-bank-txn-card'

export function BankExchangeBankTxnListScreen() {
  const [search, setSearch] = useState('')
  const list = useBankExchangeBankTxns({ search })

  return (
    <PagedListScreen
      title={messages.finance.bankExchangeBankTxn.title}
      subtitle={messages.finance.bankExchangeBankTxn.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="bank"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <BankExchangeBankTxnCard txn={item} />}
    />
  )
}
