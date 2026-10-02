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

const yesNo = (value: boolean) =>
  value ? messages.lists.yes : messages.lists.no

function toRecord(item: MonitorUser): RecordView {
  return {
    title: item.email ?? item.userId,
    subtitle: item.description,
    status: {
      label: labelOf(text.statuses, item.status) ?? item.status,
      tone: item.status === 'monitoring' ? 'warning' : 'neutral',
    },
    fields: [
      { label: f.threshold, value: groupDigits(item.threshold) },
      { label: f.cryptoDeposit, value: yesNo(item.cryptoDeposit) },
      { label: f.cryptoWithdrawal, value: yesNo(item.cryptoWithdrawal) },
      { label: f.fiatDeposit, value: yesNo(item.fiatDeposit) },
    ],
    details: [
      { label: f.userId, value: item.userId },
      { label: f.fiatWithdrawal, value: yesNo(item.fiatWithdrawal) },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      {
        label: f.addedAt,
        value: item.addedAt ? formatDate(item.addedAt) : undefined,
      },
      { label: f.addedBy, value: item.addedBy },
    ],
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
      tableLabels={{ title: f.email }}
      record={toRecord}
    />
  )
}
