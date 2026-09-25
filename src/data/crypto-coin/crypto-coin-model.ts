/** `crypto.types.ts`-ийн `networkSchema` — withdraw-ban формд хэрэгтэй хэсэг. */
export type CryptoNetwork = {
  network: string
  name?: string
  /** Сервер талын regex. Хоосон бол хаягийг шалгахгүй (вэбтэй ижил). */
  addressRegex?: string
}

/** `crypto.types.ts`-ийн `coinSchema`. */
export type CryptoCoin = {
  coin: string
  name: string
  networks: CryptoNetwork[]
}

/**
 * Вэбтэй ижил: regex байхгүй бол зөвшөөрнө. Серверээс эвдэрхий regex ирвэл
 * админыг гацаахгүйн тулд мөн зөвшөөрнө — эцсийн шалгалт backend дээр.
 */
export function matchesAddressRule(
  network: CryptoNetwork | undefined,
  address: string,
): boolean {
  if (!network?.addressRegex) return true
  try {
    return new RegExp(network.addressRegex).test(address)
  } catch {
    return true
  }
}
