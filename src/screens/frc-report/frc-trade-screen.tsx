import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FrcTrade } from '@/data/frc-report/frc-report-model'
import { useFrcTrades } from '@/hooks/use-frc-reports'
import { formatDate } from '@/lib/date'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { DEFAULT_PERIOD, periodChips } from '@/lib/period-chips'

const text = messages.frc
const f = text.fields

function toRecord(item: FrcTrade): RecordView {
  return {
    title: item.email ?? item.uid,
    subtitle: `${item.symbol} · ${item.tradeType} · ${formatDate(item.date)}`,
    amount: item.mntAmount,
    fields: [
      { label: f.tokenAmount, value: item.tokenAmount },
      { label: f.usdtAmount, amount: item.usdtAmount },
      { label: f.priceUsd, amount: item.priceUsd },
      { label: f.rate, amount: item.rate },
    ],
    details: [
      { label: f.uid, value: item.uid },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.priceMnt, amount: item.priceMnt },
      { label: f.date, value: formatDate(item.date) },
    ],
  }
}

export function FrcTradeScreen() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<RangePeriod>(DEFAULT_PERIOD)
  const list = useFrcTrades(search, period)

  return (
    <PagedListScreen
      title={text.trade.title}
      subtitle={text.trade.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="trading"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{ chips: periodChips(), value: period, onChange: setPeriod }}
      tableLabels={{ title: f.email, amount: f.mntAmount }}
      record={toRecord}
    />
  )
}
