import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useCryptoWithdrawTransfers } from '@/hooks/use-crypto-withdraw-transfers'
import { messages } from '@/lib/messages'

import { CryptoWithdrawTransferCard } from './crypto-withdraw-transfer-card'

export function CryptoWithdrawTransferListScreen() {
  const [search, setSearch] = useState('')
  const list = useCryptoWithdrawTransfers({ search })

  return (
    <PagedListScreen
      title={messages.finance.cryptoWithdrawTransfers.title}
      subtitle={messages.finance.cryptoWithdrawTransfers.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="transfer"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <CryptoWithdrawTransferCard transfer={item} />}
    />
  )
}
