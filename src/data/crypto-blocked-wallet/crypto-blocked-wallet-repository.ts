import { clients } from '@/core/network/clients'
import { unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toCryptoBlockedWallet,
  type CryptoBlockedWalletDto,
} from './crypto-blocked-wallet-dto'
import type { CryptoBlockedWallet } from './crypto-blocked-wallet-model'

/** Endpoint: `crypto.service.ts` — `POST {backoffice}/crypto/blocked-wallets/list`. */
export type CryptoBlockedWalletListParams = {
  current: number
  pageSize: number
  query?: string
  status?: string
}

export type NewWalletBan = {
  coin: string
  network: string
  address: string
  reason: string
}

export const cryptoBlockedWalletRepository = {
  async list(
    params: CryptoBlockedWalletListParams,
  ): Promise<ListPage<CryptoBlockedWallet>> {
    const response = await clients.backoffice.post(
      '/crypto/blocked-wallets/list',
      {
        current: params.current,
        pageSize: params.pageSize,
        ...(params.query ? { query: params.query } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    )

    const page = unwrapList<CryptoBlockedWalletDto>(
      response.data,
      'crypto-blocked-wallets',
    )
    return { ...page, items: page.items.map(toCryptoBlockedWallet) }
  },

  /** `walletWithdrawBanByAdmin` — `POST {compliance}/wallet/withdraw-ban`. */
  async ban(input: NewWalletBan): Promise<void> {
    await clients.compliance.post('/wallet/withdraw-ban', input)
  },
}
