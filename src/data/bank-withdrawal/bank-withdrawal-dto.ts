import type { BankWithdrawal } from './bank-withdrawal-model'

export type BankWithdrawalDto = {
  id?: string
  created_at?: string
  accountNumber?: string
  Bank?: { code?: string } | null
  Wallet?: { walletCode?: string }
  metadata?: {
    serviceFee?: number
    serviceFeeTxnId?: string
    txnFeeTxnId?: string
    txnTaskId?: string
  }
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
    bankCode: dto.Bank?.code,
    paymentWalletId: dto.Wallet?.walletCode,
    currency,
    feeAmount:
      dto.feeAmount === undefined
        ? undefined
        : { raw: dto.feeAmount, currency },
    serviceFee:
      dto.metadata?.serviceFee === undefined
        ? undefined
        : { raw: dto.metadata.serviceFee, currency },
    serviceFeeTxnId: dto.metadata?.serviceFeeTxnId,
    txnFeeTxnId: dto.metadata?.txnFeeTxnId,
    txnTaskId: dto.metadata?.txnTaskId,
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
