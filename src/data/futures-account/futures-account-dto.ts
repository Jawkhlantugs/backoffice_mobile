import { partyLabel, type PartyDto } from '@/data/shared/party-dto'

import type {
  FuturesAccount,
  FuturesClosedPosition,
} from './futures-account-model'

export type FuturesAccountDto = {
  id: string
  email?: string
  role?: string
  userId?: string
  traderUserId?: string
  createdAt?: string
  User?: PartyDto | null
}

export type FuturesClosedPositionDto = {
  id: string
  symbol?: string
  positionSide?: string
  closeReason?: string
  quantity?: number
  openPrice?: number
  closePrice?: number
  realizedPnl?: number
  holdingMs?: number
  accountId?: string
  openedAt?: string
  closedAt?: string
  User?: PartyDto | null
}

export function toFuturesAccount(dto: FuturesAccountDto): FuturesAccount {
  return {
    id: dto.id,
    email: dto.email || partyLabel(dto.User) || dto.userId || dto.id,
    role: dto.role ?? '',
    userId: dto.userId ?? '',
    traderUserId: dto.traderUserId ?? '',
    createdAt: dto.createdAt ?? '',
  }
}

/** Тоог string болгож л дамжуулна — дэлгэц дээр тооцоо хийхгүй. */
const text = (value: number | undefined) =>
  value === undefined ? '' : String(value)

export function toFuturesClosedPosition(
  dto: FuturesClosedPositionDto,
): FuturesClosedPosition {
  const pnl = text(dto.realizedPnl)
  return {
    id: dto.id,
    symbol: dto.symbol ?? '',
    positionSide: dto.positionSide ?? '',
    closeReason: dto.closeReason ?? '',
    quantity: text(dto.quantity),
    openPrice: text(dto.openPrice),
    closePrice: text(dto.closePrice),
    realizedPnl: pnl,
    isLoss: pnl.startsWith('-'),
    holdingMs: dto.holdingMs ?? 0,
    user: partyLabel(dto.User),
    accountId: dto.accountId ?? '',
    openedAt: dto.openedAt ?? '',
    closedAt: dto.closedAt ?? '',
  }
}
