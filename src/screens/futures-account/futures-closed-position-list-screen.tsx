import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FuturesClosedPosition } from '@/data/futures-account/futures-account-model'
import { useFuturesClosedPositions } from '@/hooks/use-futures-accounts'
import { formatDate, formatDuration } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function FuturesClosedPositionListScreen() {
  const [search, setSearch] = useState('')
  const list = useFuturesClosedPositions(search)

  return (
    <PagedListScreen
      title={text.futuresClosed.title}
      subtitle={text.futuresClosed.subtitle}
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

function toCard(item: FuturesClosedPosition): RecordView {
  return {
    title: item.symbol,
    subtitle: [item.user, formatDate(item.closedAt)]
      .filter(Boolean)
      .join(' · '),
    status: {
      label: item.realizedPnl,
      tone: item.isLoss ? 'danger' : 'success',
    },
    fields: [
      { label: f.side, value: item.positionSide },
      { label: f.quantity, value: item.quantity },
      { label: f.openPrice, value: item.openPrice },
      { label: f.closePrice, value: item.closePrice },
    ],
    details: [
      { label: f.pnl, value: item.realizedPnl },
      { label: f.closeReason, value: item.closeReason },
      { label: f.holding, value: formatDuration(item.holdingMs) },
      { label: f.openedAt, value: formatDate(item.openedAt) },
      { label: f.account, value: item.accountId },
    ],
  }
}
