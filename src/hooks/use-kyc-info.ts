import { kycInfoRepository } from '@/data/kyc-info/kyc-info-repository'

import { usePagedList } from './use-paged-list'

export const useKycInfos = (search: string) =>
  usePagedList('kyc-info', kycInfoRepository.list, { search })
