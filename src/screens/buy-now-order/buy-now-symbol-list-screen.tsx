import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { BuyNowSymbol } from '@/data/buy-now-symbol/buy-now-symbol-model'
import { useBuyNowSymbols } from '@/hooks/use-portal-extras'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

const text = messages.buyNowSymbols
const f = text.fields

/** Вэбийн `buy-now/symbols/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.base,
  f.quote,
  f.basePrecision,
  f.quotePrecision,
  f.order,
  f.active,
  'status',
] as const

/** Вэб `isActive`-ийг өнгөгүй, `status`-ыг `spot-symbol` өнгөөр харуулдаг. */
function toRecord(item: BuyNowSymbol): RecordView {
  return {
    title: item.symbol,
    subtitle: `${item.baseAsset} / ${item.quoteAsset}`,
    status: {
      label: item.status,
      tone: webStatusTone(item.status, 'spot-symbol'),
    },
    fields: [
      { label: f.active, value: item.isActive ? 'Yes' : 'No' },
      { label: f.order, value: item.order },
      { label: f.basePrecision, value: item.basePrecision },
      { label: f.quotePrecision, value: item.quotePrecision },
    ],
    details: [
      { label: f.base, value: item.baseAsset },
      { label: f.quote, value: item.quoteAsset },
    ],
    columns: COLUMNS,
  }
}

/** Хос нэмэх (spot хосоос сонгох) нь вэб дээр. */
export function BuyNowSymbolListScreen() {
  const [search, setSearch] = useState('')
  const list = useBuyNowSymbols(search)

  return (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="crypto"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      tableLabels={{ title: f.symbol }}
      record={toRecord}
    />
  )
}
