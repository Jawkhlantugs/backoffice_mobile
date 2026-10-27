import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FuturesClosedPosition } from '@/data/futures-account/futures-account-model'
import { useFuturesClosedPositions } from '@/hooks/use-futures-accounts'
import { compareDecimal } from '@/lib/compare-decimal'
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
      tableLabels={{ title: f.userId }}
    />
  )
}

/** Вэбийн `futures/closed-positions/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.email,
  f.subAccountId,
  f.symbol,
  f.side,
  f.quantity,
  f.openPrice,
  f.closePrice,
  f.closeNotional,
  f.pnl,
  f.closeReason,
  f.holding,
  f.closedAt,
] as const

/** Вэб: 0-ээс их PnL ногоон, бага нь улаан, 0 саарал текст. */
function pnlTone(item: FuturesClosedPosition) {
  if (item.isLoss) return 'danger' as const
  return compareDecimal(item.realizedPnl, '0') === 0
    ? ('neutral' as const)
    : ('success' as const)
}

function toCard(item: FuturesClosedPosition): RecordView {
  const tone = pnlTone(item)
  const long = item.positionSide.toLowerCase() === 'long'
  return {
    title: item.symbol,
    tableTitle: item.userId ?? item.accountId,
    subtitle: [item.user, formatDate(item.closedAt)]
      .filter(Boolean)
      .join(' · '),
    status: { label: item.realizedPnl, tone },
    fields: [
      {
        label: f.side,
        value: item.positionSide,
        tone: long ? 'success' : 'danger',
      },
      { label: f.quantity, value: item.quantity },
      { label: f.openPrice, value: item.openPrice },
      { label: f.closePrice, value: item.closePrice },
    ],
    details: [
      {
        label: f.pnl,
        amount: { raw: item.realizedPnl, currency: 'USDT', showCode: true },
        tone,
      },
      {
        label: f.closeNotional,
        amount: item.closeNotional
          ? { raw: item.closeNotional, currency: 'USDT', showCode: true }
          : undefined,
      },
      { label: f.closeReason, value: item.closeReason },
      { label: f.holding, value: formatDuration(item.holdingMs) },
      { label: f.closedAt, value: formatDate(item.closedAt) },
      { label: f.email, value: item.email },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.symbol, value: item.symbol },
      { label: f.openedAt, value: formatDate(item.openedAt) },
      { label: f.account, value: item.accountId },
    ],
    columns: COLUMNS,
  }
}
