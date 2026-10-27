import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSessionStore } from '@/core/session/session-store'
import type { ExchangeUser } from '@/data/exchange-user/exchange-user-model'
import { banReason, type BanKind } from '@/data/exchange-user/user-ban'
import { resolveBanReason } from '@/data/exchange-user/user-ban-reason'
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

export function useChangeEmail(uid: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      oldEmail,
      newEmail,
    }: {
      oldEmail: string
      newEmail: string
    }) => userSecurityRepository.changeEmail(uid, oldEmail, newEmail),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['exchange-users'] })
      void queryClient.invalidateQueries({ queryKey: securityKey(uid) })
    },
  })
}

const BAN_REQUEST: Record<
  BanKind,
  (uid: string, isBan: boolean, reason: string) => Promise<void>
> = {
  withdraw: userSecurityRepository.withdrawBan,
  trade: userSecurityRepository.tradeBan,
  futures: userSecurityRepository.futuresBan,
}

/** `can*` туг `/users/detail`-д ч ирдэг тул хоёуланг нь шинэчилнэ. */
export function useSetBan(uid: string) {
  const queryClient = useQueryClient()
  const adminEmail = useSessionStore((store) => store.user?.email)

  return useMutation({
    mutationFn: ({
      kind,
      isBan,
      reason,
    }: {
      kind: BanKind
      isBan: boolean
      reason: string
    }) => BAN_REQUEST[kind](uid, isBan, banReason(adminEmail, reason)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: securityKey(uid) })
      void queryClient.invalidateQueries({
        queryKey: ['exchange-users', 'detail', uid],
      })
      void queryClient.invalidateQueries({ queryKey: ['user-ban-log'] })
      void queryClient.invalidateQueries({
        queryKey: ['user-withdraw-ban-latest'],
      })
    },
  })
}

/**
 * Дуудагч зөвхөн хаалттай мөрт л mount хийнэ. Withdraw нь вэбийн адил гурван
 * эх сурвалжтай; trade/futures зөвхөн админы лог.
 */
export function useBanReason(user: ExchangeUser, kind: BanKind) {
  const withdraw = kind === 'withdraw'

  const log = useQuery({
    queryKey: ['user-ban-log', kind, user.id],
    queryFn: () => userSecurityRepository.banLog(user.id, kind),
  })
  const risk = useQuery({
    queryKey: ['user-risk-score', user.id],
    queryFn: () => userSecurityRepository.riskScore(user.id),
    enabled: withdraw,
  })
  const withdrawBan = useQuery({
    queryKey: ['user-withdraw-ban-latest', user.subAccountId],
    queryFn: () =>
      userSecurityRepository.latestWithdrawBan(user.subAccountId ?? ''),
    enabled: withdraw && Boolean(user.subAccountId),
  })

  const loading = log.isLoading || risk.isLoading || withdrawBan.isLoading

  return {
    loading,
    reason: loading
      ? null
      : resolveBanReason(kind, {
          log: log.data,
          risk: risk.data,
          withdrawBan: withdrawBan.data,
        }),
  }
}
