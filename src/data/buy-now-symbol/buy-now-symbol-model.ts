/** `buy-now.types.ts`-ийн `BuyNowSymbol`. */
export type BuyNowSymbol = {
  id: string
  symbol: string
  baseAsset: string
  quoteAsset: string
  basePrecision?: number
  quotePrecision?: number
  order?: number
  isActive: boolean
  status: string
}
