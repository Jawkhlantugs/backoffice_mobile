import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotSymbol } from '@/data/spot/spot-model'
import { useSpotSymbols } from '@/hooks/use-spot'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

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
      tableLabels={{ title: f.symbol }}
    />
  )
}

/** Вэбийн `spot/symbols/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.baseAsset,
  f.baseAssetName,
  f.quoteAsset,
  f.basePrecision,
  f.quotePrecision,
  f.enabled,
  f.featured,
  'status',
] as const

/** Вэб Enabled/Featured-ийг өнгөгүй, статусыг `spot-symbol` өнгөөр. */
function toCard(item: SpotSymbol): RecordView {
  return {
    title: item.symbol,
    subtitle: `${item.baseAsset} / ${item.quoteAsset}`,
    status: {
      label: item.status,
      tone: webStatusTone(item.status, 'spot-symbol'),
    },
    fields: [
      { label: f.enabled, value: item.isEnabled ? 'Yes' : 'No' },
      { label: f.featured, value: item.isFeatured ? 'Yes' : 'No' },
      { label: f.basePrecision, value: item.baseAssetPrecision },
      { label: f.quotePrecision, value: item.quoteAssetPrecision },
    ],
    details: [
      { label: f.baseAsset, value: item.baseAsset },
      { label: f.baseAssetName, value: item.baseAssetName },
      { label: f.quoteAsset, value: item.quoteAsset },
    ],
    columns: COLUMNS,
  }
}
