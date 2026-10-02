import { clients } from '@/core/network/clients'
import { unwrap } from '@/core/network/envelope'

import {
  toOperationAccountBalance,
  type OperationAccountBalanceDto,
} from './operation-account-balance-dto'
import type { OperationAccountBalance } from './operation-account-balance-model'

/** Endpoint: `transfer.service.ts` — `POST {finance}/operation-account/balance`. */
export const operationAccountBalanceRepository = {
  async get(subAccountId: string): Promise<OperationAccountBalance> {
    const response = await clients.finance.post('/operation-account/balance', {
      subAccountId,
    })
    // Вэб `(body ?? res).data` гэж уншдаг — дугтуй задарсны дараа дахин `data`.
    const outer = unwrap<
      { data?: OperationAccountBalanceDto } & OperationAccountBalanceDto
    >(response.data)
    return toOperationAccountBalance(outer.data ?? outer)
  },
}
