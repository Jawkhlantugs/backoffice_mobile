import type { BuyNowOrder } from './buy-now-order-model'

/** Серверийн JSON — `buy-now.types.ts`-ийн `BuyNowOrder`. Fiat = MNT. */
export type BuyNowOrderDto = {
  id?: string
  orderId?: string
  created_at?: string
  symbol?: { symbol?: string }
  User?: { id?: string; email?: string }
  UserId?: string
  cryptoCurrency?: string
  orderStatus?: string
  userPayAmountInCrypto?: number
  userPayAmountInFiat?: number
  userGetAmountInCrypto?: number
  userGetAmountInFiat?: number
  userTotalFeeAmountInCrypto?: number
  userTotalFeeAmountInFiat?: number
}

export function toBuyNowOrder(dto: BuyNowOrderDto): BuyNowOrder {
  const crypto = dto.cryptoCurrency ?? ''

  return {
    id: dto.id ?? '',
    orderId: dto.orderId,
    userEmail: dto.User?.email,
    userId: dto.User?.id ?? dto.UserId ?? undefined,
    symbol: dto.symbol?.symbol,
    cryptoCurrency: crypto,
    orderStatus: dto.orderStatus ?? '',
    userPayAmount: {
      raw: dto.userPayAmountInFiat ?? dto.userPayAmountInCrypto ?? 0,
      currency: 'MNT',
    },
    userGetAmount: { raw: dto.userGetAmountInCrypto ?? 0, currency: crypto },
    userTotalFee: { raw: dto.userTotalFeeAmountInFiat ?? 0, currency: 'MNT' },
    createdAt: dto.created_at,
  }
}
