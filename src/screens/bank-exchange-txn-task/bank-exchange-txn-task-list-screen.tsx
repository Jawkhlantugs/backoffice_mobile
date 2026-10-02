import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useBankExchangeTxnTasks } from '@/hooks/use-bank-exchange-txn-task'
import { messages } from '@/lib/messages'

import { bankExchangeTxnTaskRecord } from './bank-exchange-txn-task-record'

export function BankExchangeTxnTaskListScreen() {
  const [search, setSearch] = useState('')
  const list = useBankExchangeTxnTasks({ search })

  return (
    <PagedListScreen
      title={messages.finance.bankExchangeTxnTask.title}
      subtitle={messages.finance.bankExchangeTxnTask.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="transaction"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      record={bankExchangeTxnTaskRecord}
    />
  )
}
