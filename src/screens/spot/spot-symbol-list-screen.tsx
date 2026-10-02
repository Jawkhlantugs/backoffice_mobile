import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotSymbol } from '@/data/spot/spot-model'
import { useSpotSymbols } from '@/hooks/use-spot'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields

export function SpotSymbolListScreen() {
  const [search, setSearch] = useState('')
  const list = useSpotSymbols(search)

  return (
    <PagedListScreen
      title={text.spotSymbols.title}
      subtitle={text.spotSymbols.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="config"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
    />
  )
}

function toCard(item: SpotSymbol): RecordView {
  return {
    title: item.symbol,
    subtitle: `${item.baseAsset} / ${item.quoteAsset}`,
    status: { label: item.status, tone: statusTone(item.status) },
    fields: [
      { label: f.enabled, value: item.isEnabled ? text.yes : text.no },
      { label: f.featured, value: item.isFeatured ? text.yes : text.no },
      {
        label: f.precision,
        value: `${item.baseAssetPrecision} / ${item.quoteAssetPrecision}`,
      },
    ],
  }
}
