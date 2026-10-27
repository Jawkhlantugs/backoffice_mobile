import type { CryptoWithdrawal } from './crypto-withdrawal-model'

export type CryptoWithdrawalDto = {
  id?: string
  created_at?: string
  userId?: string
  User?: { id?: string; email?: string }
  operationAccount?: { name?: string; binanceEmail?: string } | null
  BWFee?: number
  SWFee?: number
  transferTime?: string
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
    operationAccount:
      dto.operationAccount?.name || dto.operationAccount?.binanceEmail,
    address: dto.address,
    amount: { raw: dto.amount ?? 0, currency },
    receiveAmount:
      dto.receiveAmount === undefined
        ? undefined
        : { raw: dto.receiveAmount, currency },
    bwFee: dto.BWFee,
    swFee: dto.SWFee,
    coin: currency,
    network: dto.network,
    status: dto.status ?? 0,
    txnId: dto.txnId,
    transferStatus: dto.transferStatus ?? undefined,
    usdtValuation: dto.usdtValuation,
    transferTime: dto.transferTime,
    createdAt: dto.created_at,
  }
}
