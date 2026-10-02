import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { UserWalletAddress } from '@/data/crypto-registry/crypto-registry-model'
import { useUserWalletAddresses } from '@/hooks/use-crypto-registry'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function CryptoWalletAddressListScreen() {
  const [search, setSearch] = useState('')
  const list = useUserWalletAddresses(search)

  return (
    <PagedListScreen
      title={text.cryptoWalletAddresses.title}
      subtitle={text.cryptoWalletAddresses.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="wallet"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: UserWalletAddress): RecordView {
  return {
    title: item.owner ?? item.address ?? item.id,
    subtitle: [item.coin, item.network].filter(Boolean).join(' · '),
    fields: [
      { label: f.address, value: item.address },
      { label: f.isDefault, value: item.isDefault ? text.yes : text.no },
    ],
    details: [
      { label: f.tag, value: item.tag },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
  }
}
