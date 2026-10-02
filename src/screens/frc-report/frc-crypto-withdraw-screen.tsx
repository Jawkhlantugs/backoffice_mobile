import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FrcCryptoWithdraw } from '@/data/frc-report/frc-report-model'
import { useFrcCryptoWithdrawals } from '@/hooks/use-frc-reports'
import { formatDate } from '@/lib/date'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { DEFAULT_PERIOD, periodChips } from '@/lib/period-chips'

const text = messages.frc
const f = text.fields

function toRecord(item: FrcCryptoWithdraw): RecordView {
  return {
    title: item.email ?? item.uid,
    subtitle: `${item.asset} · ${formatDate(item.createdAt)}`,
    amount: item.amount,
    fields: [
      { label: f.priceUsd, amount: item.priceUsd },
      { label: f.totalMnt, amount: item.totalMnt },
      { label: f.rate, amount: item.rate },
      { label: f.subAccountId, value: item.subAccountId },
    ],
    details: [
      { label: f.uid, value: item.uid },
      { label: f.priceMnt, amount: item.priceMnt },
      { label: f.from, value: item.from },
      { label: f.to, value: item.to },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      {
        label: f.finishedAt,
        value: item.finishedAt ? formatDate(item.finishedAt) : undefined,
      },
    ],
  }
}

export function FrcCryptoWithdrawScreen() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<RangePeriod>(DEFAULT_PERIOD)
  const list = useFrcCryptoWithdrawals(search, period)

  return (
    <PagedListScreen
      title={text.cryptoWithdraw.title}
      subtitle={text.cryptoWithdraw.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="crypto"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{ chips: periodChips(), value: period, onChange: setPeriod }}
      tableLabels={{ title: f.email, amount: f.amount }}
      record={toRecord}
    />
  )
}
