import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useCryptoWithdrawals } from '@/hooks/use-crypto-withdrawals'
import { messages } from '@/lib/messages'

import { CryptoWithdrawalCard } from './crypto-withdrawal-card'

export function CryptoWithdrawalListScreen() {
  const [search, setSearch] = useState('')
  const list = useCryptoWithdrawals({ search })

  return (
    <PagedListScreen
      title={messages.finance.cryptoWithdrawal.title}
      subtitle={messages.finance.cryptoWithdrawal.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="crypto"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <CryptoWithdrawalCard withdrawal={item} />}
    />
  )
}
