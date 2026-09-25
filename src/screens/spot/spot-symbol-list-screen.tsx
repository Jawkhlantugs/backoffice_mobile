import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
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
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(item: SpotSymbol): React.ComponentProps<typeof RecordCard> {
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
