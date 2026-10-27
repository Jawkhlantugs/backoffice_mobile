import { clients } from '@/core/network/clients'
import type { ListPage, PageParams } from '@/core/network/envelope'
import { amountFilterToApi } from '@/data/shared/amount-filter'
import { fetchList } from '@/data/shared/fetch-list'

import { toBankWithdrawal, type BankWithdrawalDto } from './bank-withdrawal-dto'
import type { BankWithdrawal } from './bank-withdrawal-model'

/**
 * Endpoint: `bank.service.ts` — `POST {backoffice}/banks/withdrawals/list`.
 * Шүүлтүүрийн түлхүүр вэбийн `withdrawal/constants.ts`-ийн `FILTER_KEYS`;
 * `query` нь User ID, Sub Account ID, имэйлээр хайна.
 */
export type BankWithdrawalListParams = PageParams & {
  id?: string
  status?: string
  txnId?: string
  accountNumber?: string
  totalAmount?: string
  condition?: string
  start_day?: string
  end_day?: string
}

export const bankWithdrawalRepository = {
  list({
    totalAmount,
    condition,
    start_day,
    end_day,
    ...rest
  }: BankWithdrawalListParams): Promise<ListPage<BankWithdrawal>> {
    const amountValue = amountFilterToApi(totalAmount)
    return fetchList(
      clients.backoffice,
      '/banks/withdrawals/list',
      {
        ...rest,
        totalAmount: amountValue,
        condition: amountValue === undefined ? undefined : condition,
        sortDate: start_day && end_day ? { start_day, end_day } : undefined,
      },
      (dto: BankWithdrawalDto) => toBankWithdrawal(dto),
    )
  },

  /** Мөнгө хөдөлгөнө — дуудагч тал ConfirmSheet-ээр хамгаална (§1.5). */
  async markTransferred(id: string): Promise<void> {
    await clients.bankV2.put(`/user-bank-withdraw/${id}/mark-transferred`)
  },
}
