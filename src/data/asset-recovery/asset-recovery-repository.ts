import { clients } from '@/core/network/clients'
import type { CursorParams } from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import { toAssetRecovery } from './asset-recovery-dto'

/** Endpoint: `asset-recovery.service.ts` — `{finance}/asset-recovery/*`. */
export const assetRecoveryRepository = {
  /** Хайлт нь имэйлээр (вэбийн хайлтын талбар). */
  list: (params: CursorParams & { status?: string }) =>
    fetchCursorList(
      clients.finance,
      '/asset-recovery/list',
      params,
      { limit: params.limit, email: params.query, status: params.status },
      toAssetRecovery,
    ),

  /** Хөрөнгийг хэрэглэгчид олгоно — зөвхөн `user_claimed` үед (вэб). */
  async approve(id: string): Promise<void> {
    await clients.finance.put(`/asset-recovery/${id}/approve`)
  },
}
