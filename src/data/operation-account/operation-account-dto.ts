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

/**
 * Backend нэг `subAccountId`-г хэд хэдэн мөрөөр буцаадаг. Шилжүүлэг зөвхөн
 * `subAccountId` илгээдэг тул эхнийхийг л үлдээнэ — сонголтын key давхцахгүй.
 */
export function toOperationAccounts(
  dtos: OperationAccountDto[],
): OperationAccount[] {
  const unique = new Map<string, OperationAccount>()
  for (const dto of dtos) {
    const account = toOperationAccount(dto)
    if (account && !unique.has(account.subAccountId)) {
      unique.set(account.subAccountId, account)
    }
  }
  return [...unique.values()]
}
