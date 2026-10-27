import { View } from 'react-native'

import { AppText, Skeleton } from '@/components'
import type { ExchangeUser } from '@/data/exchange-user/exchange-user-model'
import type { BanKind } from '@/data/exchange-user/user-ban'
import type { BanReason } from '@/data/exchange-user/user-ban-reason'
import { useBanReason } from '@/hooks/use-user-security'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.users.ban

function rows(reason: BanReason): { label: string; value: string }[] {
  if (reason.source === 'risk') {
    return [
      {
        label: text.reasonLabel,
        value: `${text.riskReason} (${text.score}: ${reason.score ?? '-'})`,
      },
      ...(reason.details
        ? [{ label: text.details, value: reason.details }]
        : []),
      ...(reason.date
        ? [{ label: text.date, value: formatDate(reason.date) }]
        : []),
      { label: text.by, value: reason.by },
    ]
  }
  return [
    ...(reason.reason
      ? [{ label: text.reasonLabel, value: reason.reason }]
      : []),
    ...(reason.date
      ? [{ label: text.date, value: formatDate(reason.date) }]
      : []),
    ...(reason.source === 'log' && reason.by
      ? [{ label: text.by, value: reason.by }]
      : []),
  ]
}

/** Хаалттай мөрийн доорх шалтгаан — вэбийн `BanBanner`-ийн нүдний товчны агуулга. */
export function UserBanReason({
  user,
  kind,
}: {
  user: ExchangeUser
  kind: BanKind
}) {
  const { loading, reason } = useBanReason(user, kind)

  if (loading) return <Skeleton className="h-10 w-full" />

  const lines = reason ? rows(reason) : []

  return (
    <View className="gap-1 rounded-lg bg-muted px-3 py-2">
      {lines.length === 0 ? (
        <AppText variant="caption">{text.noReason}</AppText>
      ) : (
        lines.map((line) => (
          <View key={line.label} className="flex-row gap-2">
            <AppText variant="caption" className="w-20">
              {line.label}
            </AppText>
            <AppText variant="caption" className="flex-1 text-foreground">
              {line.value}
            </AppText>
          </View>
        ))
      )}
    </View>
  )
}
