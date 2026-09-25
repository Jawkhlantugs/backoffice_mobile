import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userSecurityRepository } from '@/data/exchange-user/user-security-repository'
import type { MfaName } from '@/data/exchange-user/user-security-model'

function securityKey(uid: string) {
  return ['user-security', uid] as const
}

export function useUserSecurity(uid: string) {
  return useQuery({
    queryKey: securityKey(uid),
    queryFn: () => userSecurityRepository.get(uid),
    enabled: uid.length > 0,
  })
}

function useSecurityMutation<TInput>(
  mutationFn: (input: TInput) => Promise<void>,
  uid: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: securityKey(uid) })
    },
  })
}

export function useResetMfa(uid: string) {
  return useSecurityMutation(
    (mfaName: MfaName) => userSecurityRepository.resetMfa(uid, mfaName),
    uid,
  )
}

export function useAccountEnable(uid: string) {
  return useSecurityMutation(
    () => userSecurityRepository.accountEnable(uid),
    uid,
  )
}

export function useWithdrawBan(uid: string) {
  return useSecurityMutation(
    ({ isWithdrawBan, reason }: { isWithdrawBan: boolean; reason: string }) =>
      userSecurityRepository.withdrawBan(uid, isWithdrawBan, reason),
    uid,
  )
}

export function useTradeBan(uid: string) {
  return useSecurityMutation(
    ({ isTradeBan, reason }: { isTradeBan: boolean; reason: string }) =>
      userSecurityRepository.tradeBan(uid, isTradeBan, reason),
    uid,
  )
}

export function useFuturesBan(uid: string) {
  return useSecurityMutation(
    ({ isFuturesBan, reason }: { isFuturesBan: boolean; reason: string }) =>
      userSecurityRepository.futuresBan(uid, isFuturesBan, reason),
    uid,
  )
}
