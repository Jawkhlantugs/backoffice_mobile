import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotOrder } from '@/data/spot/spot-model'
import { useSpotOrders } from '@/hooks/use-spot'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

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
      tableLabels={{ title: f.orderId }}
    />
  )
}

/** Вэб BUY-г ногоон, SELL-ийг улаан Badge-аар харуулдаг. */
const sideTone = (side: string) => (side === 'BUY' ? 'success' : 'danger')

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

/** Вэбийн `spot/orders/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.date,
  f.broker,
  f.symbol,
  f.side,
  f.type,
  f.price,
  f.amount,
  'status',
] as const

function toCard(item: SpotOrder): RecordView {
  return {
    title: item.symbol,
    tableTitle: item.id,
    subtitle: [item.user, formatDate(item.transactTime)]
      .filter(Boolean)
      .join(' · '),
    status: {
      label: item.status,
      tone: webStatusTone(item.status, 'spot-order'),
    },
    amount: item.quoteQty,
    fields: [
      { label: f.side, value: item.side, tone: sideTone(item.side) },
      { label: f.type, value: item.type },
      { label: f.price, amount: item.price },
      {
        label: f.executed,
        value: `${item.executedQty} / ${item.origQty ?? '—'}`,
      },
    ],
    details: [
      { label: f.date, value: dateOf(item.createdAt) },
      { label: f.broker, value: item.user },
      { label: f.symbol, value: item.symbol },
      { label: f.amount, value: item.origQty },
      { label: f.timeInForce, value: item.timeInForce },
      { label: f.clientOrderId, value: item.clientOrderId },
      { label: f.createdAt, value: dateOf(item.transactTime) },
    ],
    columns: COLUMNS,
  }
}
