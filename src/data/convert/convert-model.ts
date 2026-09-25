import type { AmountField } from '@/core/money/format'

/** Convert domain model — вэб админы `convert.types.ts`-ийн `ConvertRecord`. */
export type ConvertRecord = {
  id: string
  userEmail?: string
  userId?: string
  fromAmount: AmountField
  toAmount: AmountField
  rate?: string
  status: string
  createdAt?: string
}
