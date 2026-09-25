import type { CryptoWithdrawal } from './crypto-withdrawal-model'

export type CryptoWithdrawalDto = {
  id?: string
  created_at?: string
  userId?: string
  User?: { id?: string; email?: string }
  address?: string
  amount?: number
  receiveAmount?: number
  coin?: { coin?: string }
  network?: string
  status?: number
  txnId?: string
  transferStatus?: string | null
  usdtValuation?: number
}

export function toCryptoWithdrawal(dto: CryptoWithdrawalDto): CryptoWithdrawal {
  const currency = dto.coin?.coin ?? ''

  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.userId ?? undefined,
    address: dto.address,
    amount: { raw: dto.amount ?? 0, currency },
    receiveAmount:
      dto.receiveAmount === undefined
        ? undefined
        : { raw: dto.receiveAmount, currency },
    network: dto.network,
    status: dto.status ?? 0,
    txnId: dto.txnId,
    transferStatus: dto.transferStatus ?? undefined,
    usdtValuation: dto.usdtValuation,
    createdAt: dto.created_at,
  }
}
