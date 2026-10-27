import { View } from 'react-native'

import {
  AppCard,
  AppText,
  InfoRow,
  RecordActions,
  StateView,
  type RecordAction,
} from '@/components'
import type { ExchangeUser } from '@/data/exchange-user/exchange-user-model'
import { hasAnyBan } from '@/data/exchange-user/user-ban'
import type { MfaName } from '@/data/exchange-user/user-security-model'
import { useResetMfa, useUserSecurity } from '@/hooks/use-user-security'
import { messages } from '@/lib/messages'

const text = messages.users.security

function enabledLabel(value: boolean): string {
  return value ? text.enabled : text.disabled
}

export function UserSecurityTab({ user }: { user: ExchangeUser }) {
  const query = useUserSecurity(user.id)
  const resetMfa = useResetMfa(user.id)
  const security = query.data

  const banned = hasAnyBan(user, security)

  function resetAction(
    mfaName: MfaName,
    label: string,
    enabled: boolean,
  ): RecordAction {
    return {
      key: mfaName,
      label,
      icon: 'key',
      destructive: true,
      // Тестийн санал: баталгаажуулаагүй хүчин зүйлд reset товч утгагүй.
      hidden: !enabled,
      confirm: {
        title: text.resetMfaTitle,
        description: `${user.email} · ${label}`,
      },
      run: () => resetMfa.mutateAsync(mfaName),
    }
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
            <InfoRow
              label={text.phoneNumber}
              value={security.phoneNumber || text.notAvailable}
            />
            <InfoRow
              label={text.softwareToken}
              value={enabledLabel(security.softwareTokenEnabled)}
            />
            <InfoRow
              label={text.antiPhishing}
              value={enabledLabel(security.antiPhishingEnabled)}
            />
            <InfoRow
              label={text.whiteList}
              value={enabledLabel(security.whiteListEnabled)}
            />
            <InfoRow
              label={text.sms}
              value={enabledLabel(security.smsEnabled)}
            />
            <InfoRow
              label={text.lastChangedEmail}
              value={security.lastChangedEmail || text.notAvailable}
            />
          </AppCard>

          {/* Вэб: хоригтой хэрэглэгчид MFA reset харуулахгүй. */}
          {banned ? (
            <AppText variant="caption" className="text-center">
              {text.bannedNoReset}
            </AppText>
          ) : security.smsEnabled || security.softwareTokenEnabled ? (
            <AppCard>
              <RecordActions
                actions={[
                  resetAction('sms', text.resetMfaSms, security.smsEnabled),
                  resetAction(
                    'token',
                    text.resetMfaToken,
                    security.softwareTokenEnabled,
                  ),
                ]}
              />
            </AppCard>
          ) : (
            <AppText variant="caption" className="text-center">
              {text.noResettable}
            </AppText>
          )}
        </View>
      ) : null}
    </StateView>
  )
}
