import type { BankWithdrawal } from './bank-withdrawal-model'

export type BankWithdrawalDto = {
  id?: string
  created_at?: string
  accountNumber?: string
  Bank?: { nameMn?: string; nameEn?: string } | null
  currency?: string
  feeAmount?: number
  receiveAmount?: number
  status?: string
  totalAmount?: number
  transferTime?: string
  userId?: string
  User?: { id?: string; email?: string }
}

export function toBankWithdrawal(dto: BankWithdrawalDto): BankWithdrawal {
  const currency = dto.currency ?? ''

  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.userId ?? undefined,
    accountNumber: dto.accountNumber,
    bankLabel: dto.Bank?.nameMn ?? dto.Bank?.nameEn,
    currency,
    feeAmount:
      dto.feeAmount === undefined
        ? undefined
        : { raw: dto.feeAmount, currency },
    receiveAmount:
      dto.receiveAmount === undefined
        ? undefined
        : { raw: dto.receiveAmount, currency },
    totalAmount:
      dto.totalAmount === undefined
        ? undefined
        : { raw: dto.totalAmount, currency },
    status: dto.status ?? '',
    transferTime: dto.transferTime,
    createdAt: dto.created_at,
  }
}
