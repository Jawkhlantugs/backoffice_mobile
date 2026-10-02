import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { CoinListing } from '@/data/crypto-registry/crypto-registry-model'
import { useCoinListings } from '@/hooks/use-crypto-registry'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function CryptoCoinListScreen() {
  const [search, setSearch] = useState('')
  const list = useCoinListings(search)

  return (
    <PagedListScreen
      title={text.cryptoCoins.title}
      subtitle={text.cryptoCoins.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="crypto"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: CoinListing): RecordView {
  const yesNo = (value: boolean) => (value ? text.yes : text.no)
  return {
    title: item.coin,
    subtitle: item.name,
    status: {
      label: item.isEnabled ? f.enabled : text.no,
      tone: item.isEnabled ? 'success' : 'neutral',
    },
    fields: [
      { label: f.deposit, value: yesNo(item.depositEnabled) },
      { label: f.withdraw, value: yesNo(item.withdrawEnabled) },
      { label: f.trading, value: yesNo(item.trading) },
      { label: f.featured, value: yesNo(item.isFeatured) },
    ],
    details: [{ label: f.networks, value: item.networks.join(', ') }],
  }
}
