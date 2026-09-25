import type { CryptoWithdrawTransfer } from './crypto-withdraw-transfer-model'

export type CryptoWithdrawTransferDto = {
  id?: string
  created_at?: string
  userId?: string | null
  User?: { id?: string; email?: string }
  coin?: { coin?: string }
  network?: string | null
  address?: string
  amount?: number
  transactionFee?: number
  receiveAmount?: number
  txId?: string | null
  status?: number
  transferType?: string | null
  usdtValuation?: number
}

export function toCryptoWithdrawTransfer(
  dto: CryptoWithdrawTransferDto,
): CryptoWithdrawTransfer {
  const currency = dto.coin?.coin ?? ''

  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.userId ?? undefined,
    address: dto.address,
    amount:
      dto.amount === undefined ? undefined : { raw: dto.amount, currency },
    transactionFee:
      dto.transactionFee === undefined
        ? undefined
        : { raw: dto.transactionFee, currency },
    receiveAmount:
      dto.receiveAmount === undefined
        ? undefined
        : { raw: dto.receiveAmount, currency },
    network: dto.network ?? undefined,
    txId: dto.txId ?? undefined,
    status: dto.status ?? 0,
    transferType: dto.transferType ?? undefined,
    usdtValuation: dto.usdtValuation,
    createdAt: dto.created_at,
  }
}
