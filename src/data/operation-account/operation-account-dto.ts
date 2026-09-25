import type { OperationAccount } from '@/data/transfer/transfer-model'

/** `users.types.ts`-ийн `operationAccountSchema` — apiKey/secretKey-г уншихгүй. */
export type OperationAccountDto = {
  subAccountId?: string
  name?: string
}

export function toOperationAccount(
  dto: OperationAccountDto,
): OperationAccount | null {
  if (!dto.subAccountId) return null
  return { subAccountId: dto.subAccountId, name: dto.name ?? dto.subAccountId }
}
