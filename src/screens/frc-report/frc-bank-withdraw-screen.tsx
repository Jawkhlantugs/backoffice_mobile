import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FrcBankWithdraw } from '@/data/frc-report/frc-report-model'
import { useFrcBankWithdrawals } from '@/hooks/use-frc-reports'
import { formatDate } from '@/lib/date'
import type { RangePeriod } from '@/lib/date-range'
import { messages } from '@/lib/messages'
import { DEFAULT_PERIOD, periodChips } from '@/lib/period-chips'

const text = messages.frc
const f = text.fields

/** Вэб `success`-ийг ногоон, бусдыг шар Badge-аар харуулдаг. */
const statusToneOf = (status: string) =>
  status.toLowerCase() === 'success'
    ? ('success' as const)
    : ('warning' as const)

/** Вэбийн `reports/frc-bank-withdraw/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.email,
  f.subAccountId,
  'amount',
  f.bank,
  f.accountNumber,
  f.date,
  'status',
] as const

function toRecord(item: FrcBankWithdraw): RecordView {
  return {
    title: item.email ?? item.uid,
    tableTitle: item.uid,
    subtitle: formatDate(item.date),
    status: { label: item.status, tone: statusToneOf(item.status) },
    amount: item.amount,
    fields: [
      { label: f.bank, value: item.bankName },
      { label: f.accountNumber, value: item.accountNumber },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.uid, value: item.uid },
    ],
    details: [
      { label: f.email, value: item.email },
      { label: f.date, value: item.date },
    ],
    columns: COLUMNS,
  }
}

export function FrcBankWithdrawScreen() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<RangePeriod>(DEFAULT_PERIOD)
  const list = useFrcBankWithdrawals(search, period)

  return (
    <PagedListScreen
      title={text.bankWithdraw.title}
      subtitle={text.bankWithdraw.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="bank"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{ chips: periodChips(), value: period, onChange: setPeriod }}
      tableLabels={{ title: f.uid, amount: f.mntAmount }}
      record={toRecord}
    />
  )
}
