import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  USER_REWARD_STATUSES,
  type UserReward,
} from '@/data/reward-hub/reward-hub-model'
import { useUserRewards } from '@/hooks/use-reward-hub'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { ALL, rewardStatus, rewardStatusChips } from './reward-status'

const text = messages.rewardHub
const f = text.fields

function toRecord(item: UserReward): RecordView {
  return {
    title: item.userId,
    subtitle: [item.rewardId, item.currentTaskCode].filter(Boolean).join(' · '),
    status: rewardStatus(item.status),
    amount: item.claimable,
    fields: [
      { label: f.currentTask, value: item.currentTaskCode },
      { label: f.userType, value: item.userType },
      { label: f.startedAt, value: formatDate(item.createdAt) },
      { label: f.deadline, value: formatDate(item.expiredAt) },
    ],
    details: [
      { label: f.claimed, amount: item.claimed },
      { label: f.minClaimable, amount: item.minClaimable },
      {
        label: f.claimedAt,
        value: item.claimedAt ? formatDate(item.claimedAt) : undefined,
      },
    ],
  }
}

export function UserRewardListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = useUserRewards(search, status === ALL ? undefined : status)

  return (
    <PagedListScreen
      title={text.userRewards.title}
      subtitle={text.userRewards.subtitle}
      list={list}
      keyExtractor={(item) => item.key}
      emptyIcon="reward"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.userPlaceholder,
      }}
      statusChips={{
        chips: rewardStatusChips(USER_REWARD_STATUSES),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.userId, amount: f.claimable }}
      record={toRecord}
    />
  )
}
