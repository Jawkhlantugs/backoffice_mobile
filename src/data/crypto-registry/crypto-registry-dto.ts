import { partyLabel, type PartyDto } from '@/data/shared/party-dto'

import type {
  CoinListing,
  DelistedTransfer,
  UserWalletAddress,
  WithdrawBan,
} from './crypto-registry-model'

export type CoinListingDto = {
  id: string
  created_at?: string
  coin?: string
  name?: string
  isEnabled?: number
  isFeatured?: number
  trading?: boolean
  depositAllEnable?: boolean
  withdrawAllEnable?: boolean
  networkList?: { name?: string; network?: string }[]
}

export type UserWalletAddressDto = {
  id: string
  created_at?: string
  User?: PartyDto
  address?: string
  coin?: string
  coinNetwork?: string
  network?: string
  tag?: string
  url?: string
  isDefault?: boolean
}

export type WithdrawBanDto = {
  id: string
  created_at?: string
  start_time?: string | null
  end_time?: string | null
  User?: PartyDto
  userId?: string
  reason?: string | null
  status?: string | null
}

export type DelistedTransferDto = {
  id: string
  created_at?: string
  User?: PartyDto
  subAccountId?: string
  asset?: string
  amount?: string
  price?: string
  returnAmount?: string
  returnAsset?: string
  returnTxnId?: string | null
  status?: string
  txnId?: string
  usdtValuation?: string
}

export function toCoinListing(dto: CoinListingDto): CoinListing {
  return {
    id: dto.id,
    coin: dto.coin ?? '',
    name: dto.name ?? dto.coin ?? '',
    isEnabled: dto.isEnabled === 1,
    isFeatured: dto.isFeatured === 1,
    trading: dto.trading === true,
    depositEnabled: dto.depositAllEnable === true,
    withdrawEnabled: dto.withdrawAllEnable === true,
    networks: (dto.networkList ?? []).flatMap((item) => {
      const name = item.name || item.network
      return name ? [name] : []
    }),
    createdAt: dto.created_at,
  }
}

export function toUserWalletAddress(
  dto: UserWalletAddressDto,
): UserWalletAddress {
  return {
    id: dto.id,
    owner: partyLabel(dto.User),
    userEmail: dto.User?.email ?? undefined,
    address: dto.address,
    coin: dto.coin,
    coinNetwork: dto.coinNetwork,
    network: dto.network,
    url: dto.url,
    tag: dto.tag,
    isDefault: dto.isDefault === true,
    createdAt: dto.created_at ?? '',
  }
}

export function toWithdrawBan(dto: WithdrawBanDto): WithdrawBan {
  return {
    id: dto.id,
    owner: partyLabel(dto.User) ?? dto.userId,
    userId: dto.User?.id,
    userEmail: dto.User?.email ?? undefined,
    reason: dto.reason ?? undefined,
    status: dto.status ?? undefined,
    startTime: dto.start_time ?? undefined,
    endTime: dto.end_time ?? undefined,
    createdAt: dto.created_at ?? '',
  }
}

const amountOf = (raw: string | undefined, currency: string | undefined) =>
  raw === undefined || raw === ''
    ? undefined
    : { raw, currency: currency ?? '' }

export function toDelistedTransfer(dto: DelistedTransferDto): DelistedTransfer {
  return {
    id: dto.id,
    owner: partyLabel(dto.User) ?? dto.subAccountId,
    subAccountId: dto.User?.subAccountId ?? undefined,
    userEmail: dto.User?.email ?? undefined,
    asset: dto.asset,
    amount: amountOf(dto.amount, dto.asset),
    returnAmount: amountOf(dto.returnAmount, dto.returnAsset),
    price: dto.price,
    usdtValuation: amountOf(dto.usdtValuation, 'USDT'),
    status: dto.status,
    txnId: dto.txnId,
    returnTxnId: dto.returnTxnId ?? undefined,
    createdAt: dto.created_at ?? '',
  }
}
