import type { AmountField } from '@/core/money/format'

/** `crypto.types.ts`-ийн `cryptoDepositSchema`. `status` нь тоон код. */
export type CryptoDeposit = {
  id: string
  userEmail?: string
  userId?: string
  amount: AmountField
  network?: string
  txId?: string
  status: number
  depositAddress?: string
  insertTime?: string
  usdtValuation?: number
  createdAt?: string
}
