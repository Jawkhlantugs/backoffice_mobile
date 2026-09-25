import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
import type { DelistedTransfer } from '@/data/crypto-registry/crypto-registry-model'
import { useDelistedTransfers } from '@/hooks/use-crypto-registry'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields

export function CryptoDelistedTransferListScreen() {
  const [search, setSearch] = useState('')
  const list = useDelistedTransfers(search)

  return (
    <PagedListScreen
      title={text.cryptoDelisted.title}
      subtitle={text.cryptoDelisted.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="convert"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(
  item: DelistedTransfer,
): React.ComponentProps<typeof RecordCard> {
  return {
    title: item.owner ?? item.id,
    subtitle: formatDate(item.createdAt),
    status: item.status
      ? { label: item.status, tone: statusTone(item.status) }
      : undefined,
    amount: item.amount,
    fields: [
      { label: f.returnAmount, amount: item.returnAmount },
      { label: f.usdtValuation, amount: item.usdtValuation },
    ],
    details: [
      { label: f.price, value: item.price },
      { label: f.txnId, value: item.txnId },
      { label: f.returnTxnId, value: item.returnTxnId },
    ],
  }
}
