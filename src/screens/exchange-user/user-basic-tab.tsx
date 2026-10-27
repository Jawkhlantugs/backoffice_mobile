import { View } from 'react-native'

import {
  AppCard,
  AppText,
  InfoRow,
  RecordActions,
  SectionHeader,
  StatusPill,
} from '@/components'
import type { ExchangeUser } from '@/data/exchange-user/exchange-user-model'
import { hasAnyBan } from '@/data/exchange-user/user-ban'
import {
  useAccountEnable,
  useChangeEmail,
  useUserSecurity,
} from '@/hooks/use-user-security'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { UserBanCard } from './user-ban-card'

const text = messages.users
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Вэбийн "Basic Information" таб — талбарын дараалал ижил. */
export function UserBasicTab({ user }: { user: ExchangeUser }) {
  const security = useUserSecurity(user.id).data
  const changeEmail = useChangeEmail(user.id)
  const accountEnable = useAccountEnable(user.id)

  const kycPassed = (user.kycLevel ?? 0) > 0
  const banned = hasAnyBan(user, security)
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')

  return (
    <View className="gap-3">
      <AppCard className="gap-3">
        <InfoRow label={text.userId} value={user.id} />
        <InfoRow label={text.name} value={fullName || '-'} />
        <InfoRow label={text.subAccountId} value={user.subAccountId ?? '-'} />
        <InfoRow label={text.email} value={user.email} />
        <InfoRow label={text.vipLevel} value={String(user.vipLevel ?? 0)} />
        <InfoRow label={text.createdAt} value={formatDate(user.createdAt)} />
        <View className="flex-row items-center justify-between gap-3">
          <AppText variant="label">{text.kycStatus}</AppText>
          <StatusPill
            label={kycPassed ? text.kycPassed : text.kycPending}
            tone={kycPassed ? 'success' : 'warning'}
          />
        </View>
      </AppCard>

      {/* Вэб: KYC-гүй хэрэглэгчид имэйл солих, хориг тавих товч харагдахгүй. */}
      {kycPassed ? (
        <>
          <UserBanCard user={user} security={security} />

          <View className="gap-2">
            <SectionHeader title={text.actions} />
            <RecordActions
              actions={[
                {
                  key: 'change-email',
                  label: text.changeEmail,
                  icon: 'edit',
                  confirm: {
                    title: text.changeEmailTitle,
                    description: user.email,
                    reason: {
                      label: text.newEmail,
                      required: true,
                      keyboardType: 'email-address',
                      validate: (value) =>
                        !EMAIL_PATTERN.test(value)
                          ? text.invalidEmail
                          : value.toLowerCase() === user.email.toLowerCase()
                            ? text.sameEmail
                            : undefined,
                    },
                  },
                  run: (newEmail) =>
                    changeEmail.mutateAsync({
                      oldEmail: user.email,
                      newEmail: newEmail ?? '',
                    }),
                },
                {
                  key: 'account-enable',
                  label: text.accountEnable,
                  icon: 'unlock',
                  // Хоригтой үед идэвхжүүлэх нь хоригийг тойрох зам болно.
                  hidden: banned,
                  confirm: {
                    title: text.accountEnableTitle,
                    description: user.email,
                  },
                  run: () => accountEnable.mutateAsync(),
                },
              ]}
            />
          </View>
        </>
      ) : null}
    </View>
  )
}
