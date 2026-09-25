import type { CryptoCoin, CryptoNetwork } from './crypto-coin-model'

type CryptoNetworkDto = {
  network?: string
  name?: string
  addressRegex?: string
}

export type CryptoCoinDto = {
  coin?: string
  name?: string
  networkList?: CryptoNetworkDto[]
}

function toNetwork(dto: CryptoNetworkDto): CryptoNetwork | null {
  if (!dto.network) return null
  return {
    network: dto.network,
    name: dto.name,
    addressRegex: dto.addressRegex || undefined,
  }
}

export function toCryptoCoin(dto: CryptoCoinDto): CryptoCoin | null {
  if (!dto.coin) return null
  return {
    coin: dto.coin,
    name: dto.name ?? dto.coin,
    networks: (dto.networkList ?? [])
      .map(toNetwork)
      .filter((network): network is CryptoNetwork => network !== null),
  }
}

/**
 * Жагсаалтад нэг coin хэд хэдэн мөрөөр ирдэг (вэб `Map`-аар давхардлыг
 * арилгадаг) — эхний мөрийг нь авна.
 */
export function uniqueCoins(dtos: CryptoCoinDto[]): CryptoCoin[] {
  const byCoin = new Map<string, CryptoCoin>()
  for (const dto of dtos) {
    const coin = toCryptoCoin(dto)
    if (coin && !byCoin.has(coin.coin)) byCoin.set(coin.coin, coin)
  }
  return [...byCoin.values()]
}
