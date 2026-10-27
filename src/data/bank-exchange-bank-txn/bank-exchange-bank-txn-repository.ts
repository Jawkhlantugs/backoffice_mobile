import { clients } from '@/core/network/clients'
import type { ListPage, PageParams } from '@/core/network/envelope'
import { amountFilterToApi } from '@/data/shared/amount-filter'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toBankExchangeBankTxn,
  type BankExchangeBankTxnDto,
} from './bank-exchange-bank-txn-dto'
import type { BankExchangeBankTxn } from './bank-exchange-bank-txn-model'

/**
 * Endpoint: `bank.service.ts` — `POST {backoffice}/banks/exchange-bank-txn/list`.
 * Шүүлтүүрийн түлхүүр вэбийн `exchange-txn/constants.ts`-ийн `FILTER_KEYS`;
 * `query` нь тайлбараар (description) хайна.
 */
export type BankExchangeBankTxnListParams = PageParams & {
  id?: string
  processStatus?: string
  amountType?: string
  mainAccountNumber?: string
  relatedAccountNumber?: string
  amount?: string
  condition?: string
  start_day?: string
  end_day?: string
}

export const bankExchangeBankTxnRepository = {
  list({
    amount,
    condition,
    start_day,
    end_day,
    ...rest
  }: BankExchangeBankTxnListParams): Promise<ListPage<BankExchangeBankTxn>> {
    const amountValue = amountFilterToApi(amount)
    return fetchList(
      clients.backoffice,
      '/banks/exchange-bank-txn/list',
      {
        ...rest,
        amount: amountValue,
        condition: amountValue === undefined ? undefined : condition,
        sortDate: start_day && end_day ? { start_day, end_day } : undefined,
      },
      (dto: BankExchangeBankTxnDto) => toBankExchangeBankTxn(dto),
    )
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async solve(txnId: string, message: string): Promise<void> {
    await clients.finance.post(`/bank-transaction/${txnId}/solve`, { message })
  },

  async refund(txnId: string, iban: string): Promise<void> {
    await clients.finance.post(`/bank-transaction/${txnId}/refund`, { iban })
  },
}
