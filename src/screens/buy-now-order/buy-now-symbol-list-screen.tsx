import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { BuyNowSymbol } from '@/data/buy-now-symbol/buy-now-symbol-model'
import { useBuyNowSymbols } from '@/hooks/use-portal-extras'
import { activeStatus } from '@/lib/active-status'
import { messages } from '@/lib/messages'

const text = messages.buyNowSymbols
const f = text.fields

function toRecord(item: BuyNowSymbol): RecordView {
  return {
    title: item.symbol,
    subtitle: `${item.baseAsset} / ${item.quoteAsset}`,
    status: activeStatus(item.isActive),
    fields: [
      { label: f.status, value: item.status },
      { label: f.order, value: item.order },
      { label: f.basePrecision, value: item.basePrecision },
      { label: f.quotePrecision, value: item.quotePrecision },
    ],
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
