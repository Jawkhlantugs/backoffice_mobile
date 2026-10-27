import { useState } from 'react'

import { PagedListScreen, type RecordView, type StatusTone } from '@/components'
import {
  nextManualStatus,
  USER_STAKE_STATUSES,
  type UserStake,
} from '@/data/stake/stake-model'
import { useChangeUserStakeStatus, useUserStakes } from '@/hooks/use-stake'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields
const ALL = 'all'

type StatusFilter = (typeof USER_STAKE_STATUSES)[number] | typeof ALL

/** Вэбийн `user-stake-list/columns.tsx`-ийн `getStakeStatusBadgeVariant`. */
const STAKE_TONE: Record<string, StatusTone> = {
  ongoing: 'success',
  redeemed: 'success',
  redeeming: 'warning',
  redeem_requested: 'warning',
  redeem_requested_manual: 'warning',
  cancel_requested: 'warning',
  cancel_requested_manual: 'warning',
  cancelling: 'warning',
  cancelled: 'danger',
}

/** Вэбийн `stake/user-stake-list/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.contract,
  f.asset,
  'amount',
  f.total,
  f.reward,
  f.apr,
  'status',
  f.status,
  f.userId,
  f.createdAt,
  f.updatedAt,
  f.cancelTime,
] as const

const dateOf = (value?: number) =>
  value === undefined ? undefined : formatDate(value)

const statusLabel = (status: string) =>
  text.stake.statuses[status as keyof typeof text.stake.statuses] ?? status

export function UserStakeListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>(ALL)
  const list = useUserStakes(search, status === ALL ? undefined : status)
  const change = useChangeUserStakeStatus()

  function toCard(item: UserStake): RecordView {
    const next = nextManualStatus(item.stakeStatus)
    return {
      title: item.uid ?? item.id,
      tableTitle: item.id,
      subtitle: `${item.asset} · ${formatDate(item.createdAt)}`,
      status: {
        label: statusLabel(item.stakeStatus),
        tone: STAKE_TONE[item.stakeStatus] ?? 'neutral',
      },
      amount: { ...item.staked, showCode: true },
      fields: [
        { label: f.reward, amount: { ...item.reward, showCode: true } },
        {
          label: f.apr,
          value: item.apr === undefined ? undefined : `${item.apr}%`,
        },
        { label: f.total, amount: { ...item.total, showCode: true } },
        // Вэб: `active` ногоон, бусад нь саарал.
        item.status
          ? {
              label: f.status,
              value: item.status,
              tone: item.status === 'active' ? 'success' : 'neutral',
            }
          : { label: f.status },
      ],
      details: [
        { label: f.contract, value: item.contractId },
        { label: f.asset, value: item.asset },
        { label: f.userId, value: item.uid },
        { label: f.txnId, value: item.txnIds.join('\n') },
        { label: f.createdAt, value: dateOf(item.createdAt) },
        { label: f.updatedAt, value: dateOf(item.updatedAt) },
        { label: f.cancelTime, value: dateOf(item.cancelTime) },
      ],
      columns: COLUMNS,
      actions: next
        ? [
            {
              key: 'approve-manual',
              label: text.stake.approveManual,
              icon: 'check',
              confirm: {
                title: text.stake.approveManualTitle,
                description: `${item.uid ?? item.id} · ${statusLabel(item.stakeStatus)} → ${statusLabel(next)}`,
              },
              run: () => change.mutateAsync({ id: item.id, status: next }),
            },
          ]
        : undefined,
    }
  }

  return (
    <PagedListScreen
      title={text.userStakes.title}
      subtitle={text.userStakes.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="stake"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.uidPlaceholder,
      }}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...USER_STAKE_STATUSES.map((value) => ({
            value,
            label: statusLabel(value),
          })),
        ],
        value: status,
        onChange: setStatus,
      }}
      record={toCard}
      tableLabels={{ title: f.id, amount: f.staked, status: f.stakeStatus }}
    />
  )
}
