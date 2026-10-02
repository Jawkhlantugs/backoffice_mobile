import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useCryptoFailedWithdrawals } from '@/hooks/use-crypto-failed-withdrawals'
import { messages } from '@/lib/messages'

import { useCryptoFailedWithdrawalRecord } from './use-crypto-failed-withdrawal-record'

export function CryptoFailedWithdrawalListScreen() {
  const record = useCryptoFailedWithdrawalRecord()
  const [search, setSearch] = useState('')
  const list = useCryptoFailedWithdrawals({ search })

  return (
    <PagedListScreen
      title={messages.finance.cryptoFailedWithdrawals.title}
      subtitle={messages.finance.cryptoFailedWithdrawals.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="warning"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      record={record}
    />
  )
}
