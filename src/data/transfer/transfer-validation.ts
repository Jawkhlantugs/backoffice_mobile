import { compareMoney, tryParseMoney, type Money } from '@/core/money/money'

import type { TransferAsset } from './transfer-model'

export type TransferField =
  'fromAccount' | 'toAccount' | 'asset' | 'amount' | 'reason'

export type TransferFormError =
  | 'required'
  | 'sameAccount'
  | 'emailNotSubAccount'
  | 'userNotFound'
  | 'invalidAmount'
  | 'exceedsBalance'

export type TransferDraft = {
  fromAccount: string
  toAccount: string
  asset?: TransferAsset
  amount: string
  reason: string
  /** Хэрэглэгч талын subAccountId олдсонгүй (`null`) эсэх. */
  fromUserMissing: boolean
  toUserMissing: boolean
}

const EMAIL = /\S+@\S+\.\S+/

/**
 * Вэбийн `transferFormSchema` + `onSubmit`-ийн шалгалт. Нэмэлт нь: дүн
 * үлдэгдлээс хэтрэхгүй (вэб slider-ээр хязгаарладаг) ба валютын орноос
 * илүү бутархайгүй (`tryParseMoney`).
 */
export function validateTransfer(draft: TransferDraft): {
  errors: Partial<Record<TransferField, TransferFormError>>
  amount?: Money
} {
  const errors: Partial<Record<TransferField, TransferFormError>> = {}
  const from = draft.fromAccount.trim()
  const to = draft.toAccount.trim()

  if (!from) errors.fromAccount = 'required'
  else if (draft.fromUserMissing) errors.fromAccount = 'userNotFound'

  if (!to) errors.toAccount = 'required'
  else if (EMAIL.test(to)) errors.toAccount = 'emailNotSubAccount'
  else if (from === to) errors.toAccount = 'sameAccount'
  else if (draft.toUserMissing) errors.toAccount = 'userNotFound'

  if (!draft.reason.trim()) errors.reason = 'required'

  if (!draft.asset) {
    errors.asset = 'required'
    return { errors }
  }

  if (!draft.amount.trim()) {
    errors.amount = 'required'
    return { errors }
  }

  const amount = tryParseMoney(draft.amount.trim(), draft.asset.asset)
  if (!amount || amount.minorUnits <= 0n) {
    errors.amount = 'invalidAmount'
    return { errors }
  }
  if (compareMoney(amount, draft.asset.available) > 0)
    errors.amount = 'exceedsBalance'

  return { errors, amount }
}

/** Баталгаажуулах цонхонд дахин бичсэн дүн яг таарах эсэх (вэб: `=== String(amount)`). */
export function amountMatches(typed: string, amount: Money): boolean {
  const parsed = tryParseMoney(typed.trim(), amount.currency.code)
  return parsed !== null && compareMoney(parsed, amount) === 0
}
