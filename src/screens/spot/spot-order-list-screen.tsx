import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotOrder } from '@/data/spot/spot-model'
import { useSpotOrders } from '@/hooks/use-spot'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields

export function SpotOrderListScreen() {
  const [search, setSearch] = useState('')
  const list = useSpotOrders(search)

  return (
    <PagedListScreen
      title={text.spotOrders.title}
      subtitle={text.spotOrders.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="trading"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: SpotOrder): RecordView {
  return {
    title: item.symbol,
    subtitle: [item.user, formatDate(item.transactTime)]
      .filter(Boolean)
      .join(' · '),
    status: { label: item.status, tone: statusTone(item.status) },
    amount: item.quoteQty,
    fields: [
      { label: f.side, value: item.side },
      { label: f.type, value: item.type },
      { label: f.price, amount: item.price },
      {
        label: f.executed,
        value: `${item.executedQty} / ${item.origQty ?? '—'}`,
      },
    ],
    details: [
      { label: f.timeInForce, value: item.timeInForce },
      { label: f.clientOrderId, value: item.clientOrderId },
      { label: f.user, value: item.user },
      { label: f.createdAt, value: formatDate(item.transactTime) },
    ],
  }
}
