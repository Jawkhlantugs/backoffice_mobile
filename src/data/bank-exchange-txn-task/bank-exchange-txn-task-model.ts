import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `exchangeTxnSchema`. */
export type BankExchangeTxnTask = {
  id: string
  amount: AmountField
  currency: string
  reason?: string
  receiverName?: string
  receiverIban?: string
  senderIban?: string
  journalNo?: string
  userId?: string
  status: string
  transferTime?: string
  requestTime?: string
  createdAt?: string
}
