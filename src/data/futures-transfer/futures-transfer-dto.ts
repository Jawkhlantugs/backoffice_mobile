import type {
  FuturesTransferRequest,
  FuturesTransferStatus,
} from './futures-transfer-model'

/** Серверийн JSON — `RawFuturesTransferRequest`. */
export type FuturesTransferRequestDto = {
  txnId?: string
  accountId?: string
  amount?: string | number
  asset?: string
  createdAt?: number
  direction?: string
  status?: string
  userId?: string
}

const KNOWN_STATUSES: FuturesTransferStatus[] = [
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'APPROVED',
  'REJECTED',
  'FAILED',
]

export function toFuturesTransferRequest(
  dto: FuturesTransferRequestDto,
): FuturesTransferRequest {
  return {
    txnId: dto.txnId ?? '',
    userId: dto.userId ?? dto.accountId,
    amount: { raw: dto.amount ?? 0, currency: dto.asset ?? '' },
    direction: dto.direction,
    status: KNOWN_STATUSES.find((status) => status === dto.status) ?? 'PENDING',
    createdAt: dto.createdAt,
  }
}
