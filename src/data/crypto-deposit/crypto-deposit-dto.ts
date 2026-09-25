import type { CryptoDeposit } from './crypto-deposit-model'

export type CryptoDepositDto = {
  id?: string
  created_at?: string
  userId?: string | null
  User?: { id?: string; email?: string }
  amount?: number
  coinSymbol?: string
  coin?: { coin?: string }
  network?: string | null
  txId?: string
  status?: number
  depositAddress?: string
  insertTime?: string
  usdtValuation?: number
}

export function toCryptoDeposit(dto: CryptoDepositDto): CryptoDeposit {
  const currency = dto.coinSymbol ?? dto.coin?.coin ?? ''

  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.userId ?? undefined,
    amount: { raw: dto.amount ?? 0, currency },
    network: dto.network ?? undefined,
    txId: dto.txId,
    status: dto.status ?? 0,
    depositAddress: dto.depositAddress,
    insertTime: dto.insertTime,
    usdtValuation: dto.usdtValuation,
    createdAt: dto.created_at,
  }
}
