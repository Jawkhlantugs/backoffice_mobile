import { useMutation, useQuery } from '@tanstack/react-query'

import { actionMfaRepository } from '@/data/auth/action-mfa-repository'
import { exchangeUserRepository } from '@/data/exchange-user/exchange-user-repository'
import { userBalanceRepository } from '@/data/exchange-user/user-balance-repository'
import {
  toTransferAsset,
  unsupportedAssets,
} from '@/data/transfer/transfer-dto'
import type {
  TransferAsset,
  TransferInput,
  TransferType,
} from '@/data/transfer/transfer-model'
import {
  transferRepository,
  type SourceAssets,
} from '@/data/transfer/transfer-repository'

import { useDebouncedValue } from './use-debounced-value'

export function useOperationAccounts() {
  return useQuery({
    queryKey: ['operation-accounts'],
    queryFn: () => transferRepository.operationAccounts(),
  })
}

/**
 * subAccountId-аар **яг таарах** хэрэглэгч (вэб: имэйл/нэрээр олдсон нь
 * тооцогдохгүй). `null` = шалгасан, олдсонгүй; `undefined` = шалгаагүй.
 */
export function useUserBySubAccount(subAccountId: string, enabled: boolean) {
  const value = useDebouncedValue(subAccountId.trim())
  const query = useQuery({
    queryKey: ['transfer-user', value],
    queryFn: async () => {
      const page = await exchangeUserRepository.list({
        current: 1,
        pageSize: 1,
        query: value,
      })
      return page.items.find((user) => user.subAccountId === value) ?? null
    },
    enabled: enabled && value.length > 0,
  })
  // Debounce хүлээж байх үед хуучин хариуг харуулахгүй.
  const settled = value === subAccountId.trim()
  return {
    ...query,
    user: settled ? query.data : undefined,
    checking: !settled || query.isFetching,
  }
}

/** Вэбийн `useTransferAssets` — эх талын төрөл бүрт өөр endpoint. */
export function useSourceAssets(options: {
  fromAccount: string
  sourceIsUser: boolean
  type: TransferType
  sourceUserId?: string
}) {
  const { fromAccount, sourceIsUser, type, sourceUserId } = options

  return useQuery<SourceAssets>({
    queryKey: [
      'transfer-assets',
      fromAccount,
      sourceIsUser,
      type,
      sourceUserId,
    ],
    queryFn: async () => {
      if (!sourceIsUser)
        return transferRepository.operationAssets(fromAccount, type)
      if (type === 'mnt') return transferRepository.userMntAssets(fromAccount)

      const balance = await userBalanceRepository.current(sourceUserId ?? '')
      const spot = balance.spot.filter((item) => item.asset !== 'MNT')
      return {
        assets: spot
          .map((item) => toTransferAsset(item.asset, item.free.raw))
          .filter((asset): asset is TransferAsset => asset !== null),
        unsupported: unsupportedAssets(
          spot.map((item) => ({ asset: item.asset, raw: item.free.raw })),
        ),
      }
    },
    enabled:
      fromAccount.trim().length > 0 &&
      (!sourceIsUser || type === 'mnt' || (sourceUserId?.length ?? 0) > 0),
    // Үлдэгдэл хуучирсан байж мөнгө хөдөлгөхгүй.
    staleTime: 0,
  })
}

/** 2FA баталгаажуулаад л шилжүүлнэ — вэбийн `mutationFn`-тэй ижил дараалал. */
export function useSendTransfer() {
  return useMutation({
    mutationFn: async ({
      code,
      input,
    }: {
      code: string
      input: TransferInput
    }) => {
      await actionMfaRepository.verifyTransfer(code)
      await transferRepository.send(input)
    },
  })
}
