import type { AmountField } from '@/core/money/format'

/** `bank.types.ts`-ийн `exchangeTxnSchema`. */
export type BankExchangeTxnTask = {
  id: string
  amount: AmountField
  receiverIban?: string
  senderIban?: string
  status: string
  transferTime?: string
  requestTime?: string
  createdAt?: string
}
