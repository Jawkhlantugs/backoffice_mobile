import { useState } from 'react'
import { View } from 'react-native'

import {
  AppButton,
  AppCard,
  ConfirmSheet,
  InfoRow,
  StateView,
  ToggleRow,
} from '@/components'
import type { MfaName } from '@/data/exchange-user/user-security-model'
import {
  useAccountEnable,
  useFuturesBan,
  useResetMfa,
  useTradeBan,
  useUserSecurity,
  useWithdrawBan,
} from '@/hooks/use-user-security'
import { messages, translateUnknownError } from '@/lib/messages'

type PendingAction =
  | { kind: 'resetMfa'; mfaName: MfaName; label: string }
  | { kind: 'unfreeze' }
  | { kind: 'withdrawBan'; next: boolean }
  | { kind: 'tradeBan'; next: boolean }
  | { kind: 'futuresBan'; next: boolean }
  | null

function enabledLabel(value: boolean | undefined): string {
  return value
    ? messages.users.security.enabled
    : messages.users.security.disabled
}

export function UserSecurityTab({ uid }: { uid: string }) {
  const query = useUserSecurity(uid)
  const resetMfa = useResetMfa(uid)
  const unfreeze = useAccountEnable(uid)
  const withdrawBan = useWithdrawBan(uid)
  const tradeBan = useTradeBan(uid)
  const futuresBan = useFuturesBan(uid)

  const [action, setAction] = useState<PendingAction>(null)
  const security = query.data

  const mutationError =
    resetMfa.error ??
    unfreeze.error ??
    withdrawBan.error ??
    tradeBan.error ??
    futuresBan.error

  async function confirm(reason?: string) {
    if (!action) return
    switch (action.kind) {
      case 'resetMfa':
        await resetMfa.mutateAsync(action.mfaName)
        break
      case 'unfreeze':
        await unfreeze.mutateAsync()
        break
      case 'withdrawBan':
        await withdrawBan.mutateAsync({
          isWithdrawBan: action.next,
          reason: reason ?? '',
        })
        break
      case 'tradeBan':
        await tradeBan.mutateAsync({
          isTradeBan: action.next,
          reason: reason ?? '',
        })
        break
      case 'futuresBan':
        await futuresBan.mutateAsync({
          isFuturesBan: action.next,
          reason: reason ?? '',
        })
        break
    }
    setAction(null)
  }

  return (
    <StateView
      loading={query.isPending}
      error={query.error}
      onRetry={() => query.refetch()}
    >
      {security ? (
        <View className="gap-3">
          <AppCard className="gap-3">
            {security.phoneNumber ? (
              <InfoRow
                label={messages.users.security.phoneNumber}
                value={security.phoneNumber}
              />
            ) : null}
            <InfoRow
              label={messages.users.security.softwareToken}
              value={enabledLabel(security.softwareTokenEnabled)}
            />
            <InfoRow
              label={messages.users.security.antiPhishing}
              value={enabledLabel(security.antiPhishingEnabled)}
            />
            <InfoRow
              label={messages.users.security.whiteList}
              value={enabledLabel(security.whiteListEnabled)}
            />
            <InfoRow
              label={messages.users.security.sms}
              value={enabledLabel(security.smsEnabled)}
            />
            {security.lastChangedEmail ? (
              <InfoRow
                label={messages.users.security.lastChangedEmail}
                value={security.lastChangedEmail}
              />
            ) : null}
          </AppCard>

          <AppCard className="gap-2">
            <AppButton
              label={messages.users.security.resetMfaSms}
              variant="secondary"
              onPress={() =>
                setAction({
                  kind: 'resetMfa',
                  mfaName: 'sms',
                  label: messages.users.security.resetMfaSms,
                })
              }
            />
            <AppButton
              label={messages.users.security.resetMfaToken}
              variant="secondary"
              onPress={() =>
                setAction({
                  kind: 'resetMfa',
                  mfaName: 'token',
                  label: messages.users.security.resetMfaToken,
                })
              }
            />
          </AppCard>

          <AppCard className="gap-3">
            <ToggleRow
              icon="lock"
              title={messages.users.security.withdrawBan}
              value={security.isWithdrawBan ?? false}
              onChange={(next) => setAction({ kind: 'withdrawBan', next })}
            />
            <ToggleRow
              icon="trading"
              title={messages.users.security.tradeBan}
              value={security.isTradeBan ?? false}
              onChange={(next) => setAction({ kind: 'tradeBan', next })}
            />
            <ToggleRow
              icon="block"
              title={messages.users.security.futuresBan}
              value={security.isFuturesBan ?? false}
              onChange={(next) => setAction({ kind: 'futuresBan', next })}
            />
          </AppCard>

          <AppCard className="gap-2">
            <AppButton
              label={messages.users.security.unfreeze}
              variant="secondary"
              onPress={() => setAction({ kind: 'unfreeze' })}
            />
          </AppCard>

          {mutationError ? (
            <InfoRow
              label={messages.common.errorTitle}
              value={translateUnknownError(mutationError)}
            />
          ) : null}
        </View>
      ) : null}

      <ConfirmSheet
        visible={action !== null}
        title={
          action?.kind === 'resetMfa'
            ? messages.users.security.resetMfaTitle
            : action?.kind === 'unfreeze'
              ? messages.users.security.unfreezeTitle
              : `${messages.users.security.ban} / ${messages.users.security.unban}`
        }
        description={
          action?.kind === 'unfreeze'
            ? messages.users.security.unfreezeHint
            : uid
        }
        reason={
          action?.kind === 'withdrawBan' ||
          action?.kind === 'tradeBan' ||
          action?.kind === 'futuresBan'
            ? {
                label: messages.users.security.banReasonPlaceholder,
                required: true,
                placeholder: messages.users.security.banReasonPlaceholder,
              }
            : undefined
        }
        destructive={action?.kind !== 'unfreeze'}
        onCancel={() => setAction(null)}
        onConfirm={confirm}
      />
    </StateView>
  )
}
