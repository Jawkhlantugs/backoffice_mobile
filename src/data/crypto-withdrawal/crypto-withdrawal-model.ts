import type { AmountField } from '@/core/money/format'

/** Вэбийн `crypto/withdrawal/constants.ts`-ийн статусын шүүлтүүр (тоон код). */
export const CRYPTO_WITHDRAWAL_STATUSES = ['1', '2', '5', '7', '8'] as const
export type CryptoWithdrawalStatus = (typeof CRYPTO_WITHDRAWAL_STATUSES)[number]

/** `crypto.types.ts`-ийн `cryptoWithdrawalSchema`. */
export type CryptoWithdrawal = {
  id: string
  userEmail?: string
  userId?: string
  /** `operationAccount.name || binanceEmail` — вэбийн "User Email" нөөц. */
  operationAccount?: string
  address?: string
  amount: AmountField
  receiveAmount?: AmountField
  bwFee?: number
  swFee?: number
  coin: string
  network?: string
  status: number
  txnId?: string
  transferStatus?: string
  usdtValuation?: number
  transferTime?: string
  createdAt?: string
}
