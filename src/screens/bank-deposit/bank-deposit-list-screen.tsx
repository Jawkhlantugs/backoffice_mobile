import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useBankDeposits } from '@/hooks/use-bank-deposits'
import { messages } from '@/lib/messages'

import { bankDepositRecord } from './bank-deposit-record'

export function BankDepositListScreen() {
  const [search, setSearch] = useState('')
  const list = useBankDeposits({ search })

  return (
    <PagedListScreen
      title={messages.finance.bankDeposits.title}
      subtitle={messages.finance.bankDeposits.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="bank"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      record={bankDepositRecord}
    />
  )
}
