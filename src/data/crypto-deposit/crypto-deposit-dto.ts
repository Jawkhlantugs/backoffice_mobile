import type { CryptoDeposit } from './crypto-deposit-model'

export type CryptoDepositDto = {
  id?: string
  created_at?: string
  userId?: string | null
  User?: { id?: string; email?: string }
  operationAccount?: { name?: string; binanceEmail?: string } | null
  amount?: number
  coinSymbol?: string
  coin?: { coin?: string }
  network?: string | null
  txId?: string
  status?: number
  address?: { address?: string } | null
  depositAddress?: string
  sourceAddress?: string
  insertTime?: string
  insertTimeMs?: number
  fetchedAtMs?: number
  usdtValuation?: number
}

export function toCryptoDeposit(dto: CryptoDepositDto): CryptoDeposit {
  const currency = dto.coinSymbol ?? dto.coin?.coin ?? ''

  return {
    id: dto.id ?? '',
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.userId ?? undefined,
    operationAccount:
      dto.operationAccount?.name || dto.operationAccount?.binanceEmail,
    amount: { raw: dto.amount ?? 0, currency },
    coin: dto.coin?.coin ?? currency,
    network: dto.network ?? undefined,
    txId: dto.txId,
    status: dto.status ?? 0,
    address: dto.address?.address,
    depositAddress: dto.depositAddress,
    sourceAddress: dto.sourceAddress,
    insertTime: dto.insertTime,
    insertTimeMs: dto.insertTimeMs,
    fetchedAtMs: dto.fetchedAtMs,
    usdtValuation: dto.usdtValuation,
    createdAt: dto.created_at,
  }
}
