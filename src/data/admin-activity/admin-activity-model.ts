/** `users.types.ts`-ийн `adminActivityLogSchema` — requestBody-г харуулахгүй (нууц утга байж болно). */
export type AdminActivity = {
  id: string
  admin: string
  action: string
  method: string
  path: string
  statusCode: number
  isError: boolean
  recordCount?: number
  ip: string
  durationMs: number
  createdAt: string
}

/** `operationAccountSchema` — apiKey/secretKey-г уншихгүй. */
export type OperationAccountRow = {
  id: string
  subAccountId: string
  name: string
  binanceEmail?: string
  description?: string
  canTrade: boolean
  canWithdraw: boolean
}
