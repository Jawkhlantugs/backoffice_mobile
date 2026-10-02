import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotTrade } from '@/data/spot/spot-model'
import { useSpotTrades } from '@/hooks/use-spot'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields

export function SpotTradeListScreen() {
  const [search, setSearch] = useState('')
  const list = useSpotTrades(search)

  return (
    <PagedListScreen
      title={text.spotTrades.title}
      subtitle={text.spotTrades.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="transaction"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: SpotTrade): RecordView {
  return {
    title: item.symbol || item.asset,
    subtitle: [item.user, formatDate(item.postDate)]
      .filter(Boolean)
      .join(' · '),
    status: item.commissionStatus
      ? {
          label: item.commissionStatus,
          tone: statusTone(item.commissionStatus),
        }
      : undefined,
    amount: item.mntAmount,
    fields: [
      { label: f.side, value: item.side },
      { label: f.type, value: item.tradeType },
      { label: f.quantity, amount: item.tokenAmount },
      { label: f.usdtValuation, amount: item.usdtAmount },
    ],
    details: [
      { label: f.price, amount: item.price },
      { label: `${f.price} (MNT)`, amount: item.mntPrice },
      { label: f.income, value: item.income },
      { label: f.txnId, value: item.tradeId },
      { label: f.user, value: item.user },
    ],
  }
}
