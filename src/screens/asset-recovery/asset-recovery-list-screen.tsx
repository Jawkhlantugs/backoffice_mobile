import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import { formatAmountSafe } from '@/core/money/format'
import {
  ASSET_RECOVERY_STATUSES,
  type AssetRecoveryRecord,
} from '@/data/asset-recovery/asset-recovery-model'
import {
  useApproveAssetRecovery,
  useAssetRecoveries,
} from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.assetRecovery
const f = text.fields
const ALL = 'all'

/** Вэбийн `asset-recovery/recovery-record/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.email,
  f.uid,
  f.asset,
  'amount',
  f.category,
  'status',
  f.updatedAt,
] as const

/** Хөрөнгө олгоно — зөвшөөрөх нь вэб шиг зөвхөн `user_claimed` үед. */
export function AssetRecoveryListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = useAssetRecoveries(search, status === ALL ? undefined : status)
  const approve = useApproveAssetRecovery()

  function toRecord(item: AssetRecoveryRecord): RecordView {
    return {
      title: item.email || item.uid || item.id,
      tableTitle: item.id,
      subtitle: `#${item.id} · ${item.category ?? ''}`,
      // Вэб статусыг өнгөгүй (default/secondary) Badge-аар харуулдаг.
      status: {
        label: labelOf(text.statuses, item.status) ?? item.status,
        tone: 'neutral',
      },
      amount: item.amount,
      fields: [
        { label: f.uid, value: item.uid },
        { label: f.category, value: item.category },
        { label: f.approvedBy, value: item.approvedBy },
        { label: f.updatedAt, value: formatDate(item.updatedAt) },
      ],
      details: [
        { label: f.email, value: item.email },
        { label: f.asset, value: item.amount.currency },
        { label: f.recordId, value: item.id },
        { label: f.subId, value: item.subId },
        { label: f.distributeDate, value: item.distributeDate },
        { label: f.distributeHash, value: item.distributeHash },
      ],
      columns: COLUMNS,
      actions: [
        {
          key: 'approve',
          label: text.approve,
          icon: 'check',
          hidden: item.status !== 'user_claimed',
          confirm: {
            title: text.approveTitle,
            description: `${item.email} · ${formatAmountSafe(item.amount.raw, item.amount.currency)}`,
          },
          run: () => approve.mutateAsync(item.id),
        },
      ],
    }
  }

  return (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="wallet"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...ASSET_RECOVERY_STATUSES.map((value) => ({
            value,
            label: text.statuses[value],
          })),
        ],
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.recordId }}
      record={toRecord}
    />
  )
}
