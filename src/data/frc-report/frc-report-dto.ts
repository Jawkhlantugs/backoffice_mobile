import type {
  FrcBankDeposit,
  FrcBankWithdraw,
  FrcConvert,
  FrcCryptoDeposit,
  FrcCryptoWithdraw,
  FrcTrade,
} from './frc-report-model'

const USD = 'USD'
const MNT = 'MNT'
const USDT = 'USDT'

type PartyDto = { uid?: string; email?: string; subAccountId?: string }

export type FrcCryptoDepositDto = PartyDto & {
  depositId?: string
  txId?: string
  coin?: string
  price?: number
  mntPrice?: number
  amount?: number
  mntAmount?: number
  fromAddress?: string
  toAddress?: string
  createTime?: string
  rate?: number
}

export type FrcCryptoWithdrawDto = PartyDto & {
  txnId?: string
  asset?: string
  price?: number
  mnt_price?: number
  amount?: number
  mnt_amount?: number
  from?: string
  to?: string
  createDate?: string
  finishDate?: string
  rate?: number
}

export type FrcTradeDto = PartyDto & {
  tradeId?: string
  symbol?: string
  price?: number
  usdtAmount?: number
  mntAmount?: number
  tokenAmount?: number
  mntPrice?: number
  tradeType?: string
  formatedDate?: string
  rate?: number
}

export type FrcBankDepositDto = PartyDto & {
  id?: string
  amount?: number
  currency?: string
  postDate?: string
  status?: string
  bankName?: string
  accountNumber?: string
}

export type FrcBankWithdrawDto = PartyDto & {
  id?: string
  amount_mnt?: number
  date?: string
  status?: string
  bankName?: string
  accountNumber?: string
}

export type FrcConvertDto = PartyDto & {
  convertId?: string
  fromAmount?: number
  fromAsset?: string
  toAmount?: number
  toAsset?: string
  rate?: number
  postDate?: string
  status?: string
}

const party = (dto: PartyDto) => ({
  uid: dto.uid ?? '',
  email: dto.email || undefined,
  subAccountId: dto.subAccountId ?? '',
})

const amount = (raw: number | undefined, currency: string) => ({
  raw: raw ?? 0,
  currency,
})

/** Тайлангийн мөрөнд тусдаа id байхгүй үед түлхүүр болгоно. */
const rowKey = (...parts: (string | number | undefined)[]) =>
  parts.filter((part) => part !== undefined && part !== '').join('-')

export function toFrcCryptoDeposit(dto: FrcCryptoDepositDto): FrcCryptoDeposit {
  const coin = dto.coin ?? ''
  return {
    ...party(dto),
    id: dto.depositId || rowKey(dto.txId, dto.uid, dto.createTime),
    coin,
    amount: amount(dto.amount, coin),
    priceUsd: amount(dto.price, USD),
    priceMnt: amount(dto.mntPrice, MNT),
    totalMnt: amount(dto.mntAmount, MNT),
    rate: amount(dto.rate, MNT),
    fromAddress: dto.fromAddress || undefined,
    toAddress: dto.toAddress || undefined,
    txId: dto.txId || undefined,
    createdAt: dto.createTime ?? '',
  }
}

export function toFrcCryptoWithdraw(
  dto: FrcCryptoWithdrawDto,
): FrcCryptoWithdraw {
  const asset = dto.asset ?? ''
  return {
    ...party(dto),
    id: dto.txnId || rowKey(dto.uid, dto.createDate, dto.amount),
    asset,
    amount: amount(dto.amount, asset),
    priceUsd: amount(dto.price, USD),
    priceMnt: amount(dto.mnt_price, MNT),
    totalMnt: amount(dto.mnt_amount, MNT),
    rate: amount(dto.rate, MNT),
    from: dto.from || undefined,
    to: dto.to || undefined,
    createdAt: dto.createDate ?? '',
    finishedAt: dto.finishDate || undefined,
  }
}

export function toFrcTrade(dto: FrcTradeDto): FrcTrade {
  return {
    ...party(dto),
    id: dto.tradeId || rowKey(dto.uid, dto.formatedDate, dto.symbol),
    symbol: dto.symbol ?? '',
    tradeType: dto.tradeType ?? '',
    priceUsd: amount(dto.price, USD),
    priceMnt: amount(dto.mntPrice, MNT),
    tokenAmount: String(dto.tokenAmount ?? ''),
    usdtAmount: amount(dto.usdtAmount, USDT),
    mntAmount: amount(dto.mntAmount, MNT),
    rate: amount(dto.rate, MNT),
    date: dto.formatedDate ?? '',
  }
}

export function toFrcBankDeposit(dto: FrcBankDepositDto): FrcBankDeposit {
  return {
    ...party(dto),
    id: dto.id || rowKey(dto.uid, dto.postDate, dto.amount),
    amount: amount(dto.amount, dto.currency || MNT),
    bankName: dto.bankName || undefined,
    accountNumber: dto.accountNumber || undefined,
    status: dto.status ?? '',
    postDate: dto.postDate ?? '',
  }
}

export function toFrcBankWithdraw(dto: FrcBankWithdrawDto): FrcBankWithdraw {
  return {
    ...party(dto),
    id: dto.id || rowKey(dto.uid, dto.date, dto.amount_mnt),
    amount: amount(dto.amount_mnt, MNT),
    bankName: dto.bankName || undefined,
    accountNumber: dto.accountNumber || undefined,
    status: dto.status ?? '',
    date: dto.date ?? '',
  }
}

export function toFrcConvert(dto: FrcConvertDto): FrcConvert {
  return {
    ...party(dto),
    id: dto.convertId || rowKey(dto.uid, dto.postDate),
    fromAmount: amount(dto.fromAmount, dto.fromAsset ?? ''),
    toAmount: amount(dto.toAmount, dto.toAsset ?? ''),
    rate: String(dto.rate ?? ''),
    status: dto.status ?? '',
    postDate: dto.postDate ?? '',
  }
}
