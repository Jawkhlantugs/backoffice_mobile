import { partyLabel, type PartyDto } from '@/data/shared/party-dto'

import type {
  BalanceTransaction,
  ExchangeBankWallet,
  UserBankWallet,
} from './bank-account-model'

export type UserBankWalletDto = {
  id: string
  created_at?: string
  walletCode?: string
  accountName?: string
  accountNumber?: string
  iban?: string
  status?: string
  verifiedAt?: string
  User?: PartyDto
  Bank?: { nameMn?: string; nameEn?: string; code?: string } | null
}

export type ExchangeBankWalletDto = {
  id: string
  accountName?: string
  accountNumber?: string
  balance?: number
  bankCode?: string
  currency?: string
  iban?: string
  order?: number
  status?: string
  usage?: string
}

export type BalanceTransactionDto = {
  id: string
  created_at?: string
  subAccountId?: string
  brokerUser?: PartyDto | null
  txnId?: string
  asset?: string
  type?: string
  beforeBalance?: number
  afterBalance?: number
  credit?: number
  debit?: number
}

export function toUserBankWallet(dto: UserBankWalletDto): UserBankWallet {
  return {
    id: dto.id,
    owner: partyLabel(dto.User),
    bankName: dto.Bank?.nameMn || dto.Bank?.nameEn || dto.Bank?.code,
    accountName: dto.accountName,
    accountNumber: dto.accountNumber,
    iban: dto.iban,
    walletCode: dto.walletCode,
    status: dto.status,
    verifiedAt: dto.verifiedAt,
    createdAt: dto.created_at ?? '',
  }
}

export function toExchangeBankWallet(
  dto: ExchangeBankWalletDto,
): ExchangeBankWallet {
  return {
    id: dto.id,
    accountName: dto.accountName,
    accountNumber: dto.accountNumber,
    bankCode: dto.bankCode,
    iban: dto.iban,
    balance:
      dto.balance === undefined
        ? undefined
        : { raw: dto.balance, currency: dto.currency ?? '' },
    status: dto.status,
    usage: dto.usage,
    order: dto.order,
  }
}

export function toBalanceTransaction(
  dto: BalanceTransactionDto,
): BalanceTransaction {
  const currency = dto.asset ?? ''
  const credit = dto.credit ?? 0
  return {
    id: dto.id,
    subAccountId: dto.subAccountId ?? '',
    owner: partyLabel(dto.brokerUser),
    txnId: dto.txnId ?? '',
    type: dto.type ?? '',
    credit: { raw: credit, currency },
    debit: { raw: dto.debit ?? 0, currency },
    before: { raw: dto.beforeBalance ?? 0, currency },
    after: { raw: dto.afterBalance ?? 0, currency },
    // Тэмдгийг л шалгана — дүнгээр тооцоо хийхгүй (§10).
    isCredit: credit !== 0,
    createdAt: dto.created_at ?? '',
  }
}
