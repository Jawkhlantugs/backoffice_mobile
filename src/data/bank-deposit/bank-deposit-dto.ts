import type { BankDeposit } from './bank-deposit-model'

export type BankDepositDto = {
  id?: string
  created_at?: string
  currency?: string
  depositAmount?: number
  email?: string
  paymentWalletId?: string
  status?: string
  transferTime?: string
  txnAmount?: number
  txnId?: string
  userId?: string
  User?: { id?: string; email?: string; subAccountId?: string }
}

export function toBankDeposit(dto: BankDepositDto): BankDeposit {
  const currency = dto.currency ?? ''

  return {
    id: dto.id ?? '',
    userEmail: dto.email || dto.User?.email,
    userId: dto.User?.id ?? dto.userId ?? undefined,
    subAccountId: dto.User?.subAccountId,
    currency,
    depositAmount: { raw: dto.depositAmount ?? 0, currency },
    txnAmount:
      dto.txnAmount === undefined
        ? undefined
        : { raw: dto.txnAmount, currency },
    txnId: dto.txnId,
    paymentWalletId: dto.paymentWalletId,
    status: dto.status ?? '',
    transferTime: dto.transferTime,
    createdAt: dto.created_at,
  }
}
