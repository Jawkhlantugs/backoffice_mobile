import { partyLabel, type PartyDto } from '@/data/shared/party-dto'

import type {
  SpotCommission,
  SpotFill,
  SpotOrder,
  SpotSymbol,
  SpotTrade,
} from './spot-model'

type SymbolDto = {
  symbol?: string
  baseAsset?: string
  quoteAsset?: string
} | null

export type SpotOrderDto = {
  id: string
  symbolId?: string
  symbol?: SymbolDto
  side?: string
  type?: string
  status?: string
  price?: string
  origQty?: string | null
  executedQty?: string
  cummulativeQuoteQty?: string
  timeInForce?: string
  clientOrderId?: string
  brokerUser?: PartyDto | null
  transactTime?: string
}

export type SpotFillDto = {
  id: string
  created_at?: string
  symbolId?: string
  symbol?: SymbolDto
  isBuyer?: number
  isMaker?: number
  price?: string
  qty?: string
  quoteQty?: string
  commission?: string | null
  commissionAsset?: string | null
  commissionIncome?: string | null
  orderId?: string | null
  tradeStatus?: string | null
  brokerUser?: PartyDto | null
}

export type SpotTradeDto = {
  id: string
  tradeId?: string
  symbolId?: string
  symbol?: SymbolDto
  asset?: string
  side?: string
  tradeType?: string
  price?: number
  tokenAmount?: number
  usdtAmount?: number
  mntAmount?: number
  mntPrice?: number
  income?: string | null
  spotCommissionsStatus?: string | null
  brokerUser?: PartyDto | null
  postDate?: string
  created_at?: string
}

export type SpotCommissionDto = {
  id: string
  tradeId?: string
  income?: string
  isCollected?: boolean
  status?: string
  brokerUser?: PartyDto | null
  fetchedAt?: string
}

export type SpotSymbolDto = {
  id: string
  symbol?: string
  baseAsset?: string
  quoteAsset?: string
  status?: string
  isEnabled?: number
  isFeatured?: number
  baseAssetPrecision?: number
  quoteAssetPrecision?: number
}

const symbolName = (dto: { symbol?: SymbolDto; symbolId?: string }) =>
  dto.symbol?.symbol ?? dto.symbolId ?? ''
const quoteOf = (symbol: SymbolDto | undefined) => symbol?.quoteAsset ?? ''

export function toSpotOrder(dto: SpotOrderDto): SpotOrder {
  const quote = quoteOf(dto.symbol)
  return {
    id: dto.id,
    symbol: symbolName(dto),
    side: dto.side ?? '',
    type: dto.type ?? '',
    status: dto.status ?? '',
    price: { raw: dto.price ?? '0', currency: quote },
    origQty: dto.origQty ?? undefined,
    executedQty: dto.executedQty ?? '0',
    quoteQty: { raw: dto.cummulativeQuoteQty ?? '0', currency: quote },
    timeInForce: dto.timeInForce ?? '',
    clientOrderId: dto.clientOrderId ?? '',
    user: partyLabel(dto.brokerUser),
    transactTime: dto.transactTime ?? '',
  }
}

export function toSpotFill(dto: SpotFillDto): SpotFill {
  const quote = quoteOf(dto.symbol)
  return {
    id: dto.id,
    symbol: symbolName(dto),
    isBuyer: dto.isBuyer === 1,
    isMaker: dto.isMaker === 1,
    price: { raw: dto.price ?? '0', currency: quote },
    qty: dto.qty ?? '0',
    quoteQty: { raw: dto.quoteQty ?? '0', currency: quote },
    commission: dto.commission
      ? { raw: dto.commission, currency: dto.commissionAsset ?? '' }
      : undefined,
    commissionIncome: dto.commissionIncome ?? undefined,
    orderId: dto.orderId ?? undefined,
    tradeStatus: dto.tradeStatus ?? undefined,
    user: partyLabel(dto.brokerUser),
    createdAt: dto.created_at ?? '',
  }
}

export function toSpotTrade(dto: SpotTradeDto): SpotTrade {
  const asset = dto.asset ?? ''
  return {
    id: dto.id,
    tradeId: dto.tradeId ?? dto.id,
    symbol: symbolName(dto),
    asset,
    side: dto.side ?? '',
    tradeType: dto.tradeType ?? '',
    price: { raw: dto.price ?? 0, currency: quoteOf(dto.symbol) },
    tokenAmount: { raw: dto.tokenAmount ?? 0, currency: asset },
    usdtAmount: { raw: dto.usdtAmount ?? 0, currency: 'USDT' },
    mntAmount: { raw: dto.mntAmount ?? 0, currency: 'MNT' },
    mntPrice: { raw: dto.mntPrice ?? 0, currency: 'MNT' },
    income: dto.income ?? undefined,
    commissionStatus: dto.spotCommissionsStatus ?? undefined,
    user: partyLabel(dto.brokerUser),
    postDate: dto.postDate ?? dto.created_at ?? '',
  }
}

export function toSpotCommission(dto: SpotCommissionDto): SpotCommission {
  return {
    id: dto.id,
    tradeId: dto.tradeId ?? '',
    income: dto.income ?? '',
    isCollected: dto.isCollected === true,
    status: dto.status ?? '',
    user: partyLabel(dto.brokerUser),
    fetchedAt: dto.fetchedAt ?? '',
  }
}

export function toSpotSymbol(dto: SpotSymbolDto): SpotSymbol {
  return {
    id: dto.id,
    symbol: dto.symbol ?? '',
    baseAsset: dto.baseAsset ?? '',
    quoteAsset: dto.quoteAsset ?? '',
    status: dto.status ?? '',
    isEnabled: dto.isEnabled === 1,
    isFeatured: dto.isFeatured === 1,
    baseAssetPrecision: dto.baseAssetPrecision ?? 0,
    quoteAssetPrecision: dto.quoteAssetPrecision ?? 0,
  }
}
