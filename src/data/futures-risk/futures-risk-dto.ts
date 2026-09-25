import type {
  FuturesMasterRisk,
  FuturesOpenOrder,
  FuturesPosition,
} from './futures-risk-model'

const USDT = 'USDT'

export type FuturesPositionDto = {
  symbol?: string
  positionAmt?: string
  entryPrice?: string
  markPrice?: string
  unrealizedProfit?: string
  leverage?: string
  positionSide?: string
}

export type FuturesMasterRiskDto = {
  environment?: string
  canTrade?: boolean
  canWithdraw?: boolean
  totalWalletBalance?: string
  totalUnrealizedProfit?: string
  totalMarginBalance?: string
  availableBalance?: string
  marginRatioPercent?: string | null
  positions?: FuturesPositionDto[]
  updatedAt?: number
}

export type FuturesOpenOrderDto = {
  orderId?: number
  symbol?: string
  side?: string
  type?: string
  price?: string
  origQty?: string
  executedQty?: string
  status?: string
}

function toPosition(dto: FuturesPositionDto): FuturesPosition {
  return {
    symbol: dto.symbol ?? '',
    positionAmt: dto.positionAmt ?? '0',
    entryPrice: dto.entryPrice,
    markPrice: dto.markPrice,
    unrealizedProfit: { raw: dto.unrealizedProfit ?? '0', currency: USDT },
    leverage: dto.leverage,
    positionSide: dto.positionSide,
  }
}

export function toFuturesMasterRisk(
  dto: FuturesMasterRiskDto,
): FuturesMasterRisk {
  return {
    environment: dto.environment ?? '',
    canTrade: dto.canTrade,
    canWithdraw: dto.canWithdraw,
    totalWalletBalance: { raw: dto.totalWalletBalance ?? '0', currency: USDT },
    totalUnrealizedProfit: {
      raw: dto.totalUnrealizedProfit ?? '0',
      currency: USDT,
    },
    totalMarginBalance: { raw: dto.totalMarginBalance ?? '0', currency: USDT },
    availableBalance: { raw: dto.availableBalance ?? '0', currency: USDT },
    marginRatioPercent: dto.marginRatioPercent ?? undefined,
    positions: (dto.positions ?? [])
      .filter(
        (position) =>
          position.positionAmt && Number(position.positionAmt) !== 0,
      )
      .map(toPosition),
    updatedAt: dto.updatedAt,
  }
}

export function toFuturesOpenOrder(dto: FuturesOpenOrderDto): FuturesOpenOrder {
  return {
    orderId: dto.orderId ?? 0,
    symbol: dto.symbol ?? '',
    side: dto.side,
    type: dto.type,
    price: dto.price,
    origQty: dto.origQty,
    executedQty: dto.executedQty,
    status: dto.status,
  }
}
