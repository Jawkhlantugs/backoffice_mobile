import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useCryptoDeposits } from '@/hooks/use-crypto-deposits'
import { messages } from '@/lib/messages'

import { CryptoDepositCard } from './crypto-deposit-card'

export function CryptoDepositListScreen({
  isOperation,
}: {
  isOperation: boolean
}) {
  const [search, setSearch] = useState('')
  const list = useCryptoDeposits(isOperation, { search })
  const copy = isOperation
    ? messages.finance.cryptoDepositOperations
    : messages.finance.cryptoDepositUsers

  return (
    <PagedListScreen
      title={copy.title}
      subtitle={copy.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="crypto"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <CryptoDepositCard deposit={item} />}
    />
  )
}
