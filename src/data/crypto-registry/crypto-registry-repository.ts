import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toCoinListing,
  toDelistedTransfer,
  toUserWalletAddress,
  toWithdrawBan,
} from './crypto-registry-dto'

/** Endpoint: `crypto.service.ts` — `POST {backoffice}/crypto/…/list`. */
export const cryptoRegistryRepository = {
  coins: (params: PageParams) =>
    fetchList(clients.backoffice, '/crypto/coins/list', params, toCoinListing),
  walletAddresses: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/crypto/wallet-addresses/list',
      params,
      toUserWalletAddress,
    ),
  withdrawBans: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/crypto/withdraw-bans/list',
      params,
      toWithdrawBan,
    ),
  delistedTransfers: (params: PageParams) =>
    fetchList(
      clients.backoffice,
      '/crypto/delisted-transfers/list',
      params,
      toDelistedTransfer,
    ),
}
