/**
 * Олон жагсаалтад давтагддаг хэрэглэгч/broker-ийн хэсэг (`brokerUserSchema`,
 * crypto/bank-ийн `userSchema`). Зөвхөн харуулах шошго гаргана.
 */
export type PartyDto = {
  id?: string
  email?: string | null
  name?: string | null
  subAccountId?: string | null
  firstName?: string | null
  lastName?: string | null
}

/** Имэйл → нэр → subAccountId → id. Юу ч үгүй бол `undefined`. */
export function partyLabel(
  party: PartyDto | null | undefined,
): string | undefined {
  if (!party) return undefined
  const fullName = [party.firstName, party.lastName].filter(Boolean).join(' ')
  return (
    party.email ||
    party.name ||
    fullName ||
    party.subAccountId ||
    party.id ||
    undefined
  )
}
