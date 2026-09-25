import type { AmountField } from '@/core/money/format'

/** `internal.types.ts`-ийн `internalTransactionSchema`. */
export type InternalTransaction = {
  id: string
  txnId: string
  amount?: AmountField
  code?: string
  from?: string
  to?: string
  binanceTxnId?: string
  createdAt: string
}

/** `internalTransactionRecordSchema`. */
export type InternalTransactionRecord = {
  id: string
  txnId: string
  amount?: AmountField
  clientTranId?: string
  from?: string
  to?: string
  status?: string
  createdAt: string
}

/** `balanceSchema` — дотоод (синк хийгдсэн) үлдэгдэл. */
export type InternalBalance = {
  id: string
  subAccountId: string
  owner?: string
  balance: AmountField
  updatedAt: string
}
