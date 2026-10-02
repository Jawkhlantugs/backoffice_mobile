import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  REWARD_TRANSACTION_STATUSES,
  type RewardTransaction,
} from '@/data/reward-hub/reward-hub-model'
import { useRewardTransactions } from '@/hooks/use-reward-hub'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { ALL, rewardStatus, rewardStatusChips } from './reward-status'

const text = messages.rewardHub
const f = text.fields

function toRecord(item: RewardTransaction): RecordView {
  return {
    title: item.userId,
    subtitle: [item.taskCode, formatDate(item.createdAt)].join(' · '),
    status: rewardStatus(item.status),
    amount: item.amount,
    fields: [
      { label: f.task, value: item.taskCode },
      { label: f.rewardId, value: item.rewardId },
      {
        label: f.transferredAt,
        value: item.transferTime ? formatDate(item.transferTime) : undefined,
      },
      { label: f.subAccountId, value: item.subAccountId },
    ],
    details: [
      { label: f.taskId, value: item.taskId },
      {
        label: f.requestedAt,
        value: item.requestedAt ? formatDate(item.requestedAt) : undefined,
      },
    ],
  }
}

export function RewardTransactionListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = useRewardTransactions(
    search,
    status === ALL ? undefined : status,
  )

  return (
    <PagedListScreen
      title={text.transactions.title}
      subtitle={text.transactions.subtitle}
      list={list}
      keyExtractor={(item) => item.taskId}
      emptyIcon="reward"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.userPlaceholder,
      }}
      statusChips={{
        chips: rewardStatusChips(REWARD_TRANSACTION_STATUSES),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.userId }}
      record={toRecord}
    />
  )
}
