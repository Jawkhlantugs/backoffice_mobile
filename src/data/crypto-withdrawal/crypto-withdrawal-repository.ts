import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'
import {
  amountFilterToApi,
  COIN_AMOUNT_CURRENCY,
} from '@/data/shared/amount-filter'
import { withSortDate } from '@/data/shared/sort-date'

import {
  toCryptoWithdrawal,
  type CryptoWithdrawalDto,
} from './crypto-withdrawal-dto'
import type { CryptoWithdrawal } from './crypto-withdrawal-model'

/**
 * Endpoint: `crypto.service.ts` — `POST {backoffice}/crypto/withdrawal-history/list`.
 * Шүүлтүүрийн түлхүүр вэбийн `crypto/withdrawal/constants.ts`-ийн `FILTER_KEYS`.
 */
export type CryptoWithdrawalListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
  id?: string
  coin?: string
  network?: string
  txId?: string
  address?: string
  amount?: string
  amountCondition?: string
  usdtValuation?: string
  usdtValuationCondition?: string
  start_day?: string
  end_day?: string
}

/** Дүн буруу эсвэл хоосон бол нөхцөлийг ч явуулахгүй. */
function amountFilter(
  raw: string | undefined,
  condition: string | undefined,
  currency: string,
) {
  const value = amountFilterToApi(raw, currency)
  return value === undefined
    ? { value: undefined, condition: undefined }
    : { value, condition: condition ?? 'EQUAL' }
}

export const cryptoWithdrawalRepository = {
  async list({
    amount,
    amountCondition,
    usdtValuation,
    usdtValuationCondition,
    ...params
  }: CryptoWithdrawalListParams): Promise<ListPage<CryptoWithdrawal>> {
    const coinAmount = amountFilter(
      amount,
      amountCondition,
      COIN_AMOUNT_CURRENCY,
    )
    const usdt = amountFilter(usdtValuation, usdtValuationCondition, 'USDT')
    const body = Object.fromEntries(
      Object.entries({
        ...withSortDate(params),
        amount: coinAmount.value,
        amountCondition: coinAmount.condition,
        usdtValuation: usdt.value,
        usdtValuationCondition: usdt.condition,
      }).filter(([, value]) => value !== undefined && value !== ''),
    )
    const response = await clients.backoffice.post(
      '/crypto/withdrawal-history/list',
      body,
    )

    const page = unwrapList<CryptoWithdrawalDto>(
      response.data,
      'crypto-withdrawal',
    )
    return { ...page, items: page.items.map(toCryptoWithdrawal) }
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async action(historyId: string, action: 'APPROVE' | 'REFUND'): Promise<void> {
    await clients.finance.post('/crypto-withdraw/action', { historyId, action })
  },
}
