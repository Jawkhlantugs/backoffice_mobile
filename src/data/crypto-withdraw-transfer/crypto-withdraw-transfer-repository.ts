import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toCryptoWithdrawTransfer,
  type CryptoWithdrawTransferDto,
} from './crypto-withdraw-transfer-dto'
import type { CryptoWithdrawTransfer } from './crypto-withdraw-transfer-model'

/** Endpoint: `crypto.service.ts` — `POST {backoffice}/crypto/withdraw-transfers/list`. */
export type CryptoWithdrawTransferListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
}

export const cryptoWithdrawTransferRepository = {
  async list(
    params: CryptoWithdrawTransferListParams,
  ): Promise<ListPage<CryptoWithdrawTransfer>> {
    const response = await clients.backoffice.post(
      '/crypto/withdraw-transfers/list',
      {
        current: params.current,
        pageSize: params.pageSize,
        ...(params.query ? { query: params.query } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    )

    const page = unwrapList<CryptoWithdrawTransferDto>(
      response.data,
      'crypto-withdraw-transfers',
    )
    return { ...page, items: page.items.map(toCryptoWithdrawTransfer) }
  },
}
