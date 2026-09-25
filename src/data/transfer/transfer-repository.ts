import { moneyToApiNumber } from '@/core/money/format'
import { clients } from '@/core/network/clients'
import { unwrap, unwrapList } from '@/core/network/envelope'
import {
  toOperationAccount,
  type OperationAccountDto,
} from '@/data/operation-account/operation-account-dto'

import {
  operationCryptoAssets,
  operationMntAsset,
  operationUnsupportedAssets,
  toTransferAsset,
  type OperationBalanceDto,
} from './transfer-dto'
import {
  apiFromAccount,
  transferPath,
  type OperationAccount,
  type TransferAsset,
  type TransferInput,
  type TransferType,
} from './transfer-model'

/** Вэб бүх operation дансыг нэг дор татдаг. */
const OPERATION_ACCOUNTS_PAGE_SIZE = 100

export type SourceAssets = { assets: TransferAsset[]; unsupported: string[] }

/**
 * Endpoint: `transfer.service.ts`, `users.service.ts`
 * (`operation-accounts/list`), `internal.service.ts` (`balances/list`).
 * Шилжүүлэхээс өмнө `actionMfaRepository.verifyTransfer` заавал (вэбтэй ижил).
 */
export const transferRepository = {
  async operationAccounts(): Promise<OperationAccount[]> {
    const response = await clients.backoffice.post(
      '/users/operation-accounts/list',
      {
        pageSize: OPERATION_ACCOUNTS_PAGE_SIZE,
      },
    )
    const page = unwrapList<OperationAccountDto>(
      response.data,
      'operation-accounts',
    )
    return page.items
      .map(toOperationAccount)
      .filter((account): account is OperationAccount => account !== null)
  },

  async operationAssets(
    subAccountId: string,
    type: TransferType,
  ): Promise<SourceAssets> {
    const response = await clients.finance.post('/operation-account/balance', {
      subAccountId,
    })
    // Вэб `(body ?? res).data` гэж уншдаг — дугтуй задарсны дараа дахин `data`.
    const outer = unwrap<{ data?: OperationBalanceDto } & OperationBalanceDto>(
      response.data,
    )
    const dto = outer.data ?? outer
    if (type === 'mnt')
      return { assets: operationMntAsset(dto), unsupported: [] }
    return {
      assets: operationCryptoAssets(dto),
      unsupported: operationUnsupportedAssets(dto),
    }
  },

  /** Хэрэглэгчийн MNT — синк хийгдсэн дотоод үлдэгдэл (вэбийн `listBalances`). */
  async userMntAssets(subAccountId: string): Promise<SourceAssets> {
    const response = await clients.backoffice.post('/internal/balances/list', {
      subAccountId,
      pageSize: 100,
    })
    const page = unwrapList<{ asset?: string; balance?: string | number }>(
      response.data,
      'internal-balances',
    )
    const mnt = page.items.find((item) => item.asset === 'MNT')
    const asset = toTransferAsset('MNT', mnt?.balance)
    return { assets: asset ? [asset] : [], unsupported: [] }
  },

  async send(input: TransferInput): Promise<void> {
    const asset = input.amount.currency.code
    await clients.finance.post(transferPath(asset, input.direction), {
      fromAccount: apiFromAccount(input.fromAccount),
      toAccount: input.toAccount,
      asset,
      reason: input.reason,
      // Endpoint JSON тоо шаарддаг (`amount: z.number()`) — §10-ийн цорын ганц үл хамаарал.
      amount: moneyToApiNumber(input.amount),
    })
  },
}
