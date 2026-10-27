import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { CoinListing } from '@/data/crypto-registry/crypto-registry-model'
import { useCoinListings } from '@/hooks/use-crypto-registry'
import { formatDate } from '@/lib/date'
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
      tableLabels={{ title: f.id }}
    />
  )
}

/** Вэбийн `crypto/coins/components/columns.tsx`-ийн дараалал (Image-гүй). */
const COLUMNS = [
  f.coin,
  f.name,
  'status',
  f.featured,
  f.trading,
  f.deposit,
  f.withdraw,
  f.networks,
  f.createdAt,
] as const

/** Вэб идэвхтэйг ногоон "Enabled", идэвхгүйг улаан "Disabled" гэж харуулдаг. */
const enabled = (label: string, value: boolean) => ({
  label,
  value: value ? 'Enabled' : 'Disabled',
  tone: value ? ('success' as const) : ('danger' as const),
})

function toCard(item: CoinListing): RecordView {
  return {
    title: item.coin,
    tableTitle: item.id,
    subtitle: item.name,
    status: {
      label: item.isEnabled ? 'Enabled' : 'Disabled',
      tone: item.isEnabled ? 'success' : 'danger',
    },
    fields: [
      enabled(f.deposit, item.depositEnabled),
      enabled(f.withdraw, item.withdrawEnabled),
      enabled(f.trading, item.trading),
      {
        label: f.featured,
        value: item.isFeatured ? 'Yes' : 'No',
        tone: item.isFeatured ? 'success' : 'neutral',
      },
    ],
    details: [
      { label: f.coin, value: item.coin },
      { label: f.name, value: item.name },
      { label: f.networks, value: item.networks.join(', ') },
      {
        label: f.createdAt,
        value: item.createdAt ? formatDate(item.createdAt) : undefined,
      },
    ],
    columns: COLUMNS,
  }
}
