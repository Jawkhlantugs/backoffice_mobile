import { cryptoWithdrawTransferRepository } from '@/data/crypto-withdraw-transfer/crypto-withdraw-transfer-repository'

import { usePagedList } from './use-paged-list'

export function useCryptoWithdrawTransfers(options: { search?: string } = {}) {
  return usePagedList(
    'crypto-withdraw-transfers',
    (params) => cryptoWithdrawTransferRepository.list(params),
    { search: options.search },
  )
}
