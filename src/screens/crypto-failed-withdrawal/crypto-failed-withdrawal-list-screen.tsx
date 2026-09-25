import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useCryptoFailedWithdrawals } from '@/hooks/use-crypto-failed-withdrawals'
import { messages } from '@/lib/messages'

import { CryptoFailedWithdrawalCard } from './crypto-failed-withdrawal-card'

export function CryptoFailedWithdrawalListScreen() {
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
      renderItem={({ item }) => <CryptoFailedWithdrawalCard item={item} />}
    />
  )
}
