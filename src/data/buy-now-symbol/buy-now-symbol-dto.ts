import type { BuyNowSymbol } from './buy-now-symbol-model'

export type BuyNowSymbolDto = {
  id?: string
  symbol: string
  baseAsset?: string
  quoteAsset?: string
  baseAssetPrecision?: number
  quoteAssetPrecision?: number
  status?: string
  isActive?: number
  order?: number
}

export function toBuyNowSymbol(dto: BuyNowSymbolDto): BuyNowSymbol {
  return {
    id: dto.id || dto.symbol,
    symbol: dto.symbol,
    baseAsset: dto.baseAsset ?? '',
    quoteAsset: dto.quoteAsset ?? '',
    basePrecision: dto.baseAssetPrecision,
    quotePrecision: dto.quoteAssetPrecision,
    order: dto.order,
    isActive: dto.isActive === 1,
    status: dto.status ?? '',
  }
}
