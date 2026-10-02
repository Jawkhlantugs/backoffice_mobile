import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotFill } from '@/data/spot/spot-model'
import { useSpotFills } from '@/hooks/use-spot'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

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
    />
  )
}

function toCard(item: SpotFill): RecordView {
  return {
    title: item.symbol,
    subtitle: [item.user, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    status: item.tradeStatus
      ? { label: item.tradeStatus, tone: statusTone(item.tradeStatus) }
      : undefined,
    amount: item.quoteQty,
    fields: [
      { label: f.side, value: item.isBuyer ? text.buy : text.sell },
      { label: f.type, value: item.isMaker ? text.maker : text.taker },
      { label: f.price, amount: item.price },
      { label: f.quantity, value: item.qty },
    ],
    details: [
      { label: f.commission, amount: item.commission },
      { label: f.income, value: item.commissionIncome },
      { label: f.orderId, value: item.orderId },
      { label: f.user, value: item.user },
    ],
  }
}
