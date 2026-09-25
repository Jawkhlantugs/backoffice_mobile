/** `futures.types.ts`-ийн `FuturesUser`. */
export type FuturesAccount = {
  id: string
  email: string
  role: string
  userId: string
  traderUserId: string
  createdAt: string
}

/**
 * `FuturesClosedPosition`. PnL/үнийн валютыг type заагаагүй тул (marketId-аас
 * хамаарна) таамаглахгүй — түүхий тоогоор харуулна (§10: тооцоо хийхгүй).
 */
export type FuturesClosedPosition = {
  id: string
  symbol: string
  positionSide: string
  closeReason: string
  quantity: string
  openPrice: string
  closePrice: string
  realizedPnl: string
  isLoss: boolean
  holdingMs: number
  user?: string
  accountId: string
  openedAt: string
  closedAt: string
}
