import type { AmountField } from '@/core/money/format'

/** `{finance}/operation-account/balance` — Binance эх ба DB-ийн үлдэгдэл. */
export type OperationAccountBalance = {
  name?: string
  description?: string
  /** Binance-ийн хөрөнгө — тэгээс их `free`-тэй нь л (вэб шиг). */
  assets: readonly { asset: string; free: AmountField; locked?: AmountField }[]
  /** Дотоод DB-ийн үлдэгдэл. */
  balances: readonly {
    asset: string
    balance: AmountField
    updatedAt?: number | string
  }[]
}

/** Master данс — үлдэгдлийг futures master-balances-аас уншдаг (вэб дээр). */
export const MASTER_OPERATION_SUB_ACCOUNT_ID = '787107359'
