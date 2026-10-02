import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  nextManualStatus,
  USER_STAKE_STATUSES,
  type UserStake,
} from '@/data/stake/stake-model'
import { useChangeUserStakeStatus, useUserStakes } from '@/hooks/use-stake'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields
const ALL = 'all'

type StatusFilter = (typeof USER_STAKE_STATUSES)[number] | typeof ALL

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
      subtitle: `${item.asset} · ${formatDate(item.createdAt)}`,
      status: {
        label: statusLabel(item.stakeStatus),
        tone: statusTone(item.stakeStatus),
      },
      amount: item.staked,
      fields: [
        { label: f.reward, amount: item.reward },
        {
          label: f.apr,
          value: item.apr === undefined ? undefined : `${item.apr}%`,
        },
      ],
      details: [
        { label: f.total, amount: item.total },
        { label: f.contract, value: item.contractId },
        { label: f.txnId, value: item.txnIds.join('\n') },
        {
          label: f.updatedAt,
          value: item.updatedAt ? formatDate(item.updatedAt) : undefined,
        },
      ],
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
    />
  )
}
