import { useQuery } from '@tanstack/react-query'

import { withUserSearch } from '@/data/exchange-user/user-search'
import { rewardHubRepository } from '@/data/reward-hub/reward-hub-repository'

import { useCursorList } from './use-cursor-list'

export const useWelcomeTasks = () =>
  useQuery({
    queryKey: ['welcome-tasks'],
    queryFn: rewardHubRepository.welcomeTasks,
  })
export const useUserRewards = (search: string, status?: string) =>
  useCursorList(
    'user-rewards',
    withUserSearch(rewardHubRepository.userRewards),
    {
      search,
      filters: { status },
    },
  )
export const useRewardTransactions = (search: string, status?: string) =>
  useCursorList(
    'reward-transactions',
    withUserSearch(rewardHubRepository.transactions),
    {
      search,
      filters: { status },
    },
  )
