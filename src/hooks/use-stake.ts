import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UserStakeStatus } from '@/data/stake/stake-model'
import { stakeRepository } from '@/data/stake/stake-repository'

import { useCursorList } from './use-cursor-list'

export const useUserStakes = (search: string, status?: string) =>
  useCursorList('stake-users', stakeRepository.userStakes, {
    search,
    filters: { status },
  })
export const useStakeAssets = () =>
  useCursorList('stake-assets', stakeRepository.assets)
export const useStakeContracts = () =>
  useCursorList('stake-contracts', stakeRepository.contracts)

export function useChangeUserStakeStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStakeStatus }) =>
      stakeRepository.changeUserStakeStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['stake-users'] })
    },
  })
}
