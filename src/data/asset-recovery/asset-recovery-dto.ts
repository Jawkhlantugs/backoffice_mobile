import type { AssetRecoveryRecord } from './asset-recovery-model'

export type AssetRecoveryDto = {
  bc_page_index: string
  amount?: string
  asset?: string
  category_desc?: string
  email?: string
  uid?: string
  subId?: string
  status?: string
  approved_by?: string
  distribute_date_time?: string
  distribute_hash?: string
  last_updated_date?: number
}

export function toAssetRecovery(dto: AssetRecoveryDto): AssetRecoveryRecord {
  return {
    id: dto.bc_page_index,
    email: dto.email ?? '',
    uid: dto.uid ?? '',
    subId: dto.subId || undefined,
    amount: { raw: dto.amount || '0', currency: dto.asset ?? '' },
    category: dto.category_desc || undefined,
    status: dto.status ?? '',
    approvedBy: dto.approved_by || undefined,
    distributeDate: dto.distribute_date_time || undefined,
    distributeHash: dto.distribute_hash || undefined,
    updatedAt: dto.last_updated_date,
  }
}
