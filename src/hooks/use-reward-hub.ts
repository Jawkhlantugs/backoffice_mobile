import { useQuery } from '@tanstack/react-query'

import { rewardHubRepository } from '@/data/reward-hub/reward-hub-repository'

import { useCursorList } from './use-cursor-list'

export const useWelcomeTasks = () =>
  useQuery({
    queryKey: ['welcome-tasks'],
    queryFn: rewardHubRepository.welcomeTasks,
  })
export const useUserRewards = (search: string, status?: string) =>
  useCursorList('user-rewards', rewardHubRepository.userRewards, {
    search,
    filters: { status },
  })
export const useRewardTransactions = (search: string, status?: string) =>
  useCursorList('reward-transactions', rewardHubRepository.transactions, {
    search,
    filters: { status },
  })
