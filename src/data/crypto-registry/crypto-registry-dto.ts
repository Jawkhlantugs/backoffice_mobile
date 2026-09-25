import { partyLabel, type PartyDto } from '@/data/shared/party-dto'

import type {
  CoinListing,
  DelistedTransfer,
  UserWalletAddress,
  WithdrawBan,
} from './crypto-registry-model'

export type CoinListingDto = {
  id: string
  coin?: string
  name?: string
  isEnabled?: number
  isFeatured?: number
  trading?: boolean
  depositAllEnable?: boolean
  withdrawAllEnable?: boolean
  networkList?: { network?: string }[]
}

export type UserWalletAddressDto = {
  id: string
  created_at?: string
  User?: PartyDto
  address?: string
  coin?: string
  network?: string
  tag?: string
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
    networks: (dto.networkList ?? []).flatMap((item) =>
      item.network ? [item.network] : [],
    ),
  }
}

export function toUserWalletAddress(
  dto: UserWalletAddressDto,
): UserWalletAddress {
  return {
    id: dto.id,
    owner: partyLabel(dto.User),
    address: dto.address,
    coin: dto.coin,
    network: dto.network,
    tag: dto.tag,
    isDefault: dto.isDefault === true,
    createdAt: dto.created_at ?? '',
  }
}

export function toWithdrawBan(dto: WithdrawBanDto): WithdrawBan {
  return {
    id: dto.id,
    owner: partyLabel(dto.User) ?? dto.userId,
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
