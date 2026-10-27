import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotCommission } from '@/data/spot/spot-model'
import { useSpotCommissions } from '@/hooks/use-spot'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

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
      tableLabels={{ title: f.id }}
    />
  )
}

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

/** Вэбийн `spot/commissions/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.date,
  f.broker,
  f.tradeId,
  f.income,
  'status',
  f.collected,
] as const

function toCard(item: SpotCommission): RecordView {
  const completed = item.status === '1'
  return {
    title: item.user ?? item.tradeId,
    tableTitle: item.id,
    subtitle: formatDate(item.fetchedAt),
    // Вэб: '1' → Completed (ногоон), бусад нь утгаараа (default Badge).
    status: {
      label: completed ? 'Completed' : item.status,
      tone: completed ? 'success' : 'neutral',
    },
    fields: [
      { label: f.income, value: item.income },
      {
        label: f.collected,
        value: item.isCollected ? 'Yes' : 'No',
        tone: item.isCollected ? 'success' : 'neutral',
      },
      { label: f.broker, value: item.user },
      { label: f.date, value: dateOf(item.createdAt) },
    ],
    details: [{ label: f.tradeId, value: item.tradeId }],
    columns: COLUMNS,
  }
}
