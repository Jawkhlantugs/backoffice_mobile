import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useBankWithdrawals } from '@/hooks/use-bank-withdrawals'
import { messages } from '@/lib/messages'

import { BankWithdrawalCard } from './bank-withdrawal-card'

export function BankWithdrawalListScreen() {
  const [search, setSearch] = useState('')
  const list = useBankWithdrawals({ search })

  return (
    <PagedListScreen
      title={messages.finance.bankWithdrawals.title}
      subtitle={messages.finance.bankWithdrawals.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="bank"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <BankWithdrawalCard withdrawal={item} />}
    />
  )
}
