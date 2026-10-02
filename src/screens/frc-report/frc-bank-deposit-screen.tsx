import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FrcBankDeposit } from '@/data/frc-report/frc-report-model'
import { useFrcBankDeposits } from '@/hooks/use-frc-reports'
import { formatDate } from '@/lib/date'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { DEFAULT_PERIOD, periodChips } from '@/lib/period-chips'
import { statusTone } from '@/lib/status-tone'

const text = messages.frc
const f = text.fields

function toRecord(item: FrcBankDeposit): RecordView {
  return {
    title: item.email ?? item.uid,
    subtitle: formatDate(item.postDate),
    status: { label: item.status, tone: statusTone(item.status) },
    amount: item.amount,
    fields: [
      { label: f.bank, value: item.bankName },
      { label: f.accountNumber, value: item.accountNumber },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.uid, value: item.uid },
    ],
  }
}

export function FrcBankDepositScreen() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<RangePeriod>(DEFAULT_PERIOD)
  const list = useFrcBankDeposits(search, period)

  return (
    <PagedListScreen
      title={text.bankDeposit.title}
      subtitle={text.bankDeposit.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="bank"
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
