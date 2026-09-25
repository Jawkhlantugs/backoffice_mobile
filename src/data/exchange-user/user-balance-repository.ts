import { clients } from '@/core/network/clients'
import { unwrap } from '@/core/network/envelope'

import {
  toUserCurrentBalance,
  type UserCurrentBalanceDto,
} from './user-balance-dto'
import type { UserCurrentBalance } from './user-balance-model'

/**
 * Endpoint: `users.service.ts` — `POST {wallet}/user/balance`.
 *
 * ⚠️ Вэб код `response.data.data.data`-аар уншдаг — энэ endpoint давхар
 * `data` дугтуйтай (`{code,msg,data:{data:{...}}}`), бусад бүхнээс өөр.
 * `unwrap()` нэг л давхаргыг задалдаг тул энд гараар хоёр дахь удаагаа
 * шалгана.
 */
export const userBalanceRepository = {
  async current(uid: string): Promise<UserCurrentBalance> {
    const response = await clients.wallet.post('/user/balance', { uid })
    const outer = unwrap<
      UserCurrentBalanceDto | { data?: UserCurrentBalanceDto }
    >(response.data)
    const payload =
      'data' in outer && outer.data !== undefined
        ? outer.data
        : (outer as UserCurrentBalanceDto)
    return toUserCurrentBalance(payload)
  },
}
