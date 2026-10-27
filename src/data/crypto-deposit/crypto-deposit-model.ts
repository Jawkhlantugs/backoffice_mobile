import type { AmountField } from '@/core/money/format'

/** `crypto.types.ts`-ийн `cryptoDepositSchema`. `status` нь тоон код. */
export type CryptoDeposit = {
  id: string
  userEmail?: string
  userId?: string
  /** `operationAccount.name || binanceEmail` — operation жагсаалтын эзэмшигч. */
  operationAccount?: string
  amount: AmountField
  coin: string
  network?: string
  txId?: string
  status: number
  /** Хэрэглэгчийн жагсаалтын `address.address`. */
  address?: string
  depositAddress?: string
  sourceAddress?: string
  insertTime?: string
  insertTimeMs?: number
  fetchedAtMs?: number
  usdtValuation?: number
  createdAt?: string
}
