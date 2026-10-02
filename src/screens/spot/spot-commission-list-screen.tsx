import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotCommission } from '@/data/spot/spot-model'
import { useSpotCommissions } from '@/hooks/use-spot'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields

export function SpotCommissionListScreen() {
  const [search, setSearch] = useState('')
  const list = useSpotCommissions(search)

  return (
    <PagedListScreen
      title={text.spotCommissions.title}
      subtitle={text.spotCommissions.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="reward"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: SpotCommission): RecordView {
  return {
    title: item.user ?? item.tradeId,
    subtitle: formatDate(item.fetchedAt),
    status: { label: item.status, tone: statusTone(item.status) },
    fields: [
      { label: f.income, value: item.income },
      { label: f.collected, value: item.isCollected ? text.yes : text.no },
    ],
    details: [{ label: f.txnId, value: item.tradeId }],
  }
}
