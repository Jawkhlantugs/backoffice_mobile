import { partyLabel, type PartyDto } from '@/data/shared/party-dto'

import type {
  InternalBalance,
  InternalTransaction,
  InternalTransactionRecord,
} from './internal-transaction-model'

export type InternalTransactionDto = {
  id: string
  created_at?: string
  txnId?: string
  amount?: number | null
  asset?: string | null
  code?: string | null
  binanceTxnId?: string | null
  fromId?: string | null
  fromBroker?: PartyDto | null
  toId?: string | null
  toBroker?: PartyDto | null
}

export type InternalTransactionRecordDto = {
  id: string
  created_at?: string
  txnId?: string
  amount?: string | null
  asset?: string | null
  clientTranId?: string | null
  fromId?: string | null
  fromBroker?: PartyDto | null
  toId?: string | null
  toBroker?: PartyDto | null
  status?: string | null
}

export type InternalBalanceDto = {
  id: string
  updated_at?: string
  subAccountId?: string
  asset?: string
  balance?: number
  broker?: PartyDto | null
}

function amountOf(
  raw: string | number | null | undefined,
  asset: string | null | undefined,
) {
  return raw === null || raw === undefined
    ? undefined
    : { raw, currency: asset ?? '' }
}

export function toInternalTransaction(
  dto: InternalTransactionDto,
): InternalTransaction {
  return {
    id: dto.id,
    txnId: dto.txnId ?? dto.id,
    amount: amountOf(dto.amount, dto.asset),
    code: dto.code ?? undefined,
    from: partyLabel(dto.fromBroker) ?? dto.fromId ?? undefined,
    to: partyLabel(dto.toBroker) ?? dto.toId ?? undefined,
    binanceTxnId: dto.binanceTxnId ?? undefined,
    createdAt: dto.created_at ?? '',
  }
}

export function toInternalTransactionRecord(
  dto: InternalTransactionRecordDto,
): InternalTransactionRecord {
  return {
    id: dto.id,
    txnId: dto.txnId ?? dto.id,
    amount: amountOf(dto.amount, dto.asset),
    clientTranId: dto.clientTranId ?? undefined,
    from: partyLabel(dto.fromBroker) ?? dto.fromId ?? undefined,
    to: partyLabel(dto.toBroker) ?? dto.toId ?? undefined,
    status: dto.status ?? undefined,
    createdAt: dto.created_at ?? '',
  }
}

export function toInternalBalance(dto: InternalBalanceDto): InternalBalance {
  return {
    id: dto.id,
    subAccountId: dto.subAccountId ?? '',
    owner: partyLabel(dto.broker),
    balance: { raw: dto.balance ?? 0, currency: dto.asset ?? '' },
    updatedAt: dto.updated_at ?? '',
  }
}
