import type { Money } from '@/core/money/money'

/** Вэбийн `TransferDirection`. User → User зориуд байхгүй (вэб ч санал болгодоггүй). */
export type TransferDirection = 'op-to-user' | 'user-to-op' | 'op-to-op'
export const TRANSFER_DIRECTIONS: readonly TransferDirection[] = [
  'op-to-user',
  'user-to-op',
  'op-to-op',
]

export type TransferType = 'mnt' | 'crypto'

/** Шилжүүлж болох хөрөнгө ба эх дансны чөлөөт үлдэгдэл. */
export type TransferAsset = { asset: string; available: Money }

export type OperationAccount = { subAccountId: string; name: string }

export type TransferInput = {
  direction: TransferDirection
  fromAccount: string
  toAccount: string
  amount: Money
  reason: string
}

export const sourceIsUser = (direction: TransferDirection) =>
  direction === 'user-to-op'
export const destIsUser = (direction: TransferDirection) =>
  direction === 'op-to-user'

/**
 * Вэбийн `transfer-form.tsx`-ийн хуулбар: master данс нь backend-д хоосон
 * `fromAccount`-оор илэрхийлэгддэг. Утгыг өөрчилбөл вэбтэй хамт өөрчил.
 */
const MASTER_SUB_ACCOUNT_ID = '787107359'

export function apiFromAccount(fromAccount: string): string {
  return fromAccount === MASTER_SUB_ACCOUNT_ID ? '' : fromAccount
}

/** MNT → `/transfer/mnt`, op→op → operation-sub-account, бусад → sub-account. */
export function transferPath(
  asset: string,
  direction: TransferDirection,
): string {
  if (asset === 'MNT') return '/transfer/mnt'
  if (direction === 'op-to-op') return '/transfer/operation-sub-account'
  return '/transfer/sub-account'
}
