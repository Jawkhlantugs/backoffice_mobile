import type { BankDeposit } from './bank-deposit-model'

export type BankDepositDto = {
  id?: string
  created_at?: string
  currency?: string
  depositAmount?: number
  status?: string
  transferTime?: string
  txnAmount?: number
  txnId?: string
  userId?: string
  User?: { id?: string; email?: string }
}

export function toBankDeposit(dto: BankDepositDto): BankDeposit {
  const currency = dto.currency ?? ''

  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.userId ?? undefined,
    currency,
    depositAmount: { raw: dto.depositAmount ?? 0, currency },
    txnAmount:
      dto.txnAmount === undefined
        ? undefined
        : { raw: dto.txnAmount, currency },
    txnId: dto.txnId,
    status: dto.status ?? '',
    transferTime: dto.transferTime,
    createdAt: dto.created_at,
  }
}
