import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FrcConvert } from '@/data/frc-report/frc-report-model'
import { useFrcConverts } from '@/hooks/use-frc-reports'
import { formatDate } from '@/lib/date'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { DEFAULT_PERIOD, periodChips } from '@/lib/period-chips'
import { statusTone } from '@/lib/status-tone'

const text = messages.frc
const f = text.fields

function toRecord(item: FrcConvert): RecordView {
  return {
    title: item.email ?? item.uid,
    subtitle: formatDate(item.postDate),
    status: { label: item.status, tone: statusTone(item.status) },
    amount: item.toAmount,
    fields: [
      { label: f.fromAmount, amount: item.fromAmount },
      { label: f.rate, value: item.rate },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.uid, value: item.uid },
    ],
    details: [{ label: f.convertId, value: item.id }],
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
      tableLabels={{ title: f.email, amount: f.toAmount }}
      record={toRecord}
    />
  )
}
