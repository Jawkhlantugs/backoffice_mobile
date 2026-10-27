import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotFill } from '@/data/spot/spot-model'
import { useSpotFills } from '@/hooks/use-spot'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function SpotFillListScreen() {
  const [search, setSearch] = useState('')
  const list = useSpotFills(search)

  return (
    <PagedListScreen
      title={text.spotFills.title}
      subtitle={text.spotFills.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="history"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.tradeId, amount: f.total }}
    />
  )
}

/** Вэб BUY-г ногоон, SELL-ийг улаан Badge-аар харуулдаг. */
const sideTone = (side: string) => (side === 'BUY' ? 'success' : 'danger')

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

/** Вэбийн `spot/history/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.date,
  f.broker,
  f.symbol,
  f.orderId,
  f.side,
  f.price,
  f.quantity,
  'amount',
  f.commission,
] as const

function toCard(item: SpotFill): RecordView {
  const side = item.isBuyer ? 'BUY' : 'SELL'
  return {
    title: item.symbol,
    tableTitle: item.id,
    subtitle: [item.user, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    status: item.tradeStatus
      ? { label: item.tradeStatus, tone: 'neutral' }
      : undefined,
    amount: item.quoteQty,
    fields: [
      { label: f.side, value: side, tone: sideTone(side) },
      { label: f.type, value: item.isMaker ? text.maker : text.taker },
      { label: f.price, amount: item.price },
      { label: f.quantity, value: item.qty },
    ],
    details: [
      { label: f.date, value: dateOf(item.createdAt) },
      { label: f.broker, value: item.user },
      { label: f.symbol, value: item.symbol },
      {
        label: f.commission,
        amount: item.commission && { ...item.commission, showCode: true },
      },
      { label: f.income, value: item.commissionIncome },
      { label: f.orderId, value: item.orderId },
    ],
    columns: COLUMNS,
  }
}
