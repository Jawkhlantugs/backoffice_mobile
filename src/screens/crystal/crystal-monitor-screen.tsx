import { useState } from 'react'

import {
  PagedListScreen,
  SegmentedControl,
  type RecordView,
  type StatusTone,
} from '@/components'
import {
  CRYSTAL_ALERT_GRADES,
  type CrystalCustomer,
  type CrystalTransfer,
} from '@/data/crystal/crystal-model'
import {
  useCrystalCustomers,
  useCrystalTransfers,
} from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.crystal
const f = text.fields
const ALL = 'all'

type Tab = 'transfers' | 'customers'

const GRADE_TONE: Readonly<Record<string, StatusTone>> = {
  severe: 'danger',
  high: 'danger',
  medium: 'warning',
}

function transferRecord(item: CrystalTransfer): RecordView {
  const grade = item.alertGrade
  return {
    title: item.customer ?? item.tx,
    subtitle: `${item.direction} · ${formatDate(item.time)}`,
    status: grade
      ? {
          label: labelOf(text.grades, grade) ?? grade,
          tone: GRADE_TONE[grade] ?? 'neutral',
        }
      : undefined,
    amount: item.amountUsd,
    fields: [
      { label: f.riskyUsd, amount: item.riskyUsd },
      { label: messages.lists.fields.amount, amount: item.amount },
      { label: f.risk, value: item.riskScore },
      { label: f.flag, value: item.flagged },
    ],
    details: [
      { label: f.tx, value: item.tx },
      { label: f.address, value: item.address },
      { label: f.direction, value: item.direction },
    ],
  }
}

function customerRecord(item: CrystalCustomer): RecordView {
  return {
    title: item.name,
    subtitle: `${item.transfers} ${f.transfers.toLowerCase()} · ${item.addresses} ${f.addresses.toLowerCase()}`,
    status:
      item.flagged > 0
        ? { label: `${f.flagged} ${item.flagged}`, tone: 'danger' }
        : undefined,
    amount: item.riskyUsd,
    fields: [
      { label: f.deposit, amount: item.depositUsd },
      { label: f.withdrawal, amount: item.withdrawalUsd },
      { label: f.transfers, value: item.transfers },
      { label: f.lastAdded, value: formatDate(item.lastAdded) },
    ],
    details: [
      { label: f.note, value: item.note },
      {
        label: f.watched,
        value: item.watched ? messages.lists.yes : messages.lists.no,
      },
    ],
  }
}

/**
 * Вэбийн Crystal monitor-ын Transfers, Customers таб. Холбоосын граф,
 * экспорт, шүүлтүүрийн нарийн муж нь вэб дээр.
 */
export function CrystalMonitorScreen() {
  const [tab, setTab] = useState<Tab>('transfers')
  const [grade, setGrade] = useState<string>(ALL)
  const transfers = useCrystalTransfers(grade === ALL ? undefined : grade)
  const customers = useCrystalCustomers()

  const tabs = (
    <SegmentedControl
      options={[
        { value: 'transfers', label: text.tabs.transfers },
        { value: 'customers', label: text.tabs.customers },
      ]}
      value={tab}
      onChange={setTab}
    />
  )

  return tab === 'transfers' ? (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={transfers}
      keyExtractor={(item) => item.id}
      emptyIcon="compliance"
      filters={tabs}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...CRYSTAL_ALERT_GRADES.map((value) => ({
            value,
            label: text.grades[value],
          })),
        ],
        value: grade,
        onChange: setGrade,
      }}
      tableLabels={{ title: f.customer, amount: f.amountUsd }}
      record={transferRecord}
    />
  ) : (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={customers}
      keyExtractor={(item) => item.token}
      emptyIcon="users"
      filters={tabs}
      tableLabels={{ title: f.customer, amount: f.riskyUsd }}
      record={customerRecord}
    />
  )
}
