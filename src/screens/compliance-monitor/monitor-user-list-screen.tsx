import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  MONITOR_USER_STATUSES,
  type MonitorUser,
} from '@/data/compliance-monitor/compliance-monitor-model'
import { useMonitorUsers } from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { groupDigits } from '@/lib/group-digits'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.monitorUsers
const f = text.fields
const ALL = 'all'

/** Вэбийн `compliance/monitor-users/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.email,
  f.description,
  f.threshold,
  'status',
  f.cryptoDeposit,
  f.cryptoWithdrawal,
  f.fiatDeposit,
  f.fiatWithdrawal,
  f.createdAt,
  f.addedAt,
] as const

/** Вэб идэвхтэй урсгалыг ногоон "Enabled", бусдыг саарал "Disabled" гэж. */
const flag = (label: string, value: boolean) => ({
  label,
  value: value ? 'Enabled' : 'Disabled',
  tone: value ? ('success' as const) : ('neutral' as const),
})

function toRecord(item: MonitorUser): RecordView {
  return {
    title: item.email ?? item.userId,
    tableTitle: item.userId,
    subtitle: item.description,
    status: {
      label: labelOf(text.statuses, item.status) ?? item.status,
      // Вэбийн `getStatusVariant`: monitoring ногоон, paused шар.
      tone:
        item.status === 'monitoring'
          ? 'success'
          : item.status === 'paused'
            ? 'warning'
            : 'neutral',
    },
    fields: [
      { label: f.threshold, value: groupDigits(item.threshold) },
      flag(f.cryptoDeposit, item.cryptoDeposit),
      flag(f.cryptoWithdrawal, item.cryptoWithdrawal),
      flag(f.fiatDeposit, item.fiatDeposit),
    ],
    details: [
      { label: f.userId, value: item.userId },
      { label: f.email, value: item.email },
      { label: f.description, value: item.description },
      flag(f.fiatWithdrawal, item.fiatWithdrawal),
      { label: f.createdAt, value: formatDate(item.createdAt) },
      {
        label: f.addedAt,
        value: item.addedAt ? formatDate(item.addedAt) : undefined,
      },
      { label: f.addedBy, value: item.addedBy },
    ],
    columns: COLUMNS,
  }
}

/** Хэрэглэгч нэмэх/засах (босго, сувгийн сонголт) нь вэб дээр. */
export function MonitorUserListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = useMonitorUsers(search, status === ALL ? undefined : status)

  return (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={list}
      keyExtractor={(item) => item.userId}
      emptyIcon="compliance"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...MONITOR_USER_STATUSES.map((value) => ({
            value,
            label: text.statuses[value],
          })),
        ],
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.userId, status: f.status }}
      record={toRecord}
    />
  )
}
