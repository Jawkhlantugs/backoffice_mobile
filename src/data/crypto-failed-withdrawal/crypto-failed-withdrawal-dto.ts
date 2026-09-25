import type { CryptoFailedWithdrawal } from './crypto-failed-withdrawal-model'

export type CryptoFailedWithdrawalDto = {
  id?: string
  created_at?: string
  uid?: string
  User?: { id?: string; email?: string }
  feeRefundStatus?: number
  mainRefundStatus?: number
  resolvedAt?: number | null
  resolvedBy?: string | null
  status?: string
  type?: string
}

export function toCryptoFailedWithdrawal(
  dto: CryptoFailedWithdrawalDto,
): CryptoFailedWithdrawal {
  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.uid ?? undefined,
    feeRefundStatus: dto.feeRefundStatus,
    mainRefundStatus: dto.mainRefundStatus,
    resolvedAt: dto.resolvedAt ?? undefined,
    resolvedBy: dto.resolvedBy ?? undefined,
    status: dto.status,
    type: dto.type,
    createdAt: dto.created_at,
  }
}
