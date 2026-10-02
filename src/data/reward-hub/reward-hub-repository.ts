import { clients } from '@/core/network/clients'
import { unwrap, type CursorParams } from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import {
  toRewardTransaction,
  toUserReward,
  toWelcomeTask,
  type WelcomeTaskDto,
} from './reward-hub-dto'
import type { WelcomeTask } from './reward-hub-model'

type Filters = CursorParams & { status?: string }

/**
 * Endpoint: `reward-hub.service.ts` — `{rewardHub}/reward-hub/*`. Хайлт нь
 * хэрэглэгчийн ID (`userId`) — вэбийн хайлтын талбар.
 */
export const rewardHubRepository = {
  async welcomeTasks(): Promise<WelcomeTask[]> {
    const response = await clients.rewardHub.post(
      '/reward-hub/rewards/list',
      {},
    )
    const data = unwrap<{ items?: WelcomeTaskDto[] } | null>(response.data)
    return (data?.items ?? [])
      .map(toWelcomeTask)
      .sort((a, b) => a.orderId - b.orderId)
  },

  userRewards: (params: Filters) =>
    fetchCursorList(
      clients.rewardHub,
      '/reward-hub/user-rewards/list',
      params,
      { limit: params.limit, userId: params.query, status: params.status },
      toUserReward,
    ),

  transactions: (params: Filters) =>
    fetchCursorList(
      clients.rewardHub,
      '/reward-hub/transaction-tasks/list',
      params,
      { limit: params.limit, userId: params.query, status: params.status },
      toRewardTransaction,
    ),
}
