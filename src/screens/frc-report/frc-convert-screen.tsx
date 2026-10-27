import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FrcConvert } from '@/data/frc-report/frc-report-model'
import { useFrcConverts } from '@/hooks/use-frc-reports'
import { formatDate } from '@/lib/date'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { DEFAULT_PERIOD, periodChips } from '@/lib/period-chips'

const text = messages.frc
const f = text.fields

/** Вэбийн `reports/frc-convert/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.email,
  f.subAccountId,
  f.fromAmount,
  f.fromAsset,
  f.toAmount,
  f.toAsset,
  f.rate,
  'status',
  f.date,
  f.convertId,
] as const

/** Вэб илгээсэн талыг улаан, хүлээн авсан талыг ногоон текстээр; статус өнгөгүй. */
function toRecord(item: FrcConvert): RecordView {
  return {
    title: item.email ?? item.uid,
    tableTitle: item.uid,
    subtitle: formatDate(item.postDate),
    status: { label: item.status, tone: 'neutral' },
    amount: item.toAmount,
    fields: [
      { label: f.fromAmount, amount: item.fromAmount, tone: 'danger' },
      { label: f.rate, value: item.rate },
      { label: f.toAmount, amount: item.toAmount, tone: 'success' },
      { label: f.subAccountId, value: item.subAccountId },
    ],
    details: [
      { label: f.uid, value: item.uid },
      { label: f.email, value: item.email },
      { label: f.fromAsset, value: item.fromAmount.currency },
      { label: f.toAsset, value: item.toAmount.currency },
      { label: f.date, value: item.postDate },
      { label: f.convertId, value: item.id },
    ],
    columns: COLUMNS,
  }
}

export function FrcConvertScreen() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<RangePeriod>(DEFAULT_PERIOD)
  const list = useFrcConverts(search, period)

  return (
    <PagedListScreen
      title={text.convert.title}
      subtitle={text.convert.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="convert"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{ chips: periodChips(), value: period, onChange: setPeriod }}
      tableLabels={{ title: f.uid, amount: f.toAmount }}
      record={toRecord}
    />
  )
}
