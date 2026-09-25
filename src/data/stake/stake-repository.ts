import { clients } from '@/core/network/clients'
import type { CursorParams, ListPage } from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import { toStakeAsset, toStakeContract, toUserStake } from './stake-dto'
import type {
  StakeAsset,
  StakeContract,
  UserStake,
  UserStakeStatus,
} from './stake-model'

/** Endpoint: `stake.service.ts` — `{staking}/admin/stake/…`. */
export const stakeRepository = {
  userStakes: (
    params: CursorParams & { status?: string },
  ): Promise<ListPage<UserStake>> =>
    fetchCursorList(
      clients.staking,
      '/admin/stake/users/list',
      params,
      {
        limit: params.limit,
        // Вэбийн хайлт нь uid-аар — mobile-ийн хайлтын талбар мөн uid.
        uid: params.query,
        status: params.status,
      },
      toUserStake,
    ),

  assets: (params: CursorParams): Promise<ListPage<StakeAsset>> =>
    fetchCursorList(
      clients.staking,
      '/admin/stake/assets/list',
      params,
      {},
      toStakeAsset,
    ),

  contracts: (params: CursorParams): Promise<ListPage<StakeContract>> =>
    fetchCursorList(
      clients.staking,
      '/admin/stake/contracts/list',
      params,
      {},
      toStakeContract,
    ),

  async changeUserStakeStatus(
    usersStakeId: string,
    status: UserStakeStatus,
  ): Promise<void> {
    await clients.staking.post('/admin/stake/users/change-status', {
      usersStakeId,
      status,
    })
  },
}
