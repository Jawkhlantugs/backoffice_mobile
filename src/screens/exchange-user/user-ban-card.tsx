import { useState } from 'react'
import { View } from 'react-native'

import {
  AppCard,
  AppIcon,
  AppText,
  ConfirmSheet,
  SectionHeader,
  ToggleRow,
  type AppIconName,
} from '@/components'
import { toast } from '@/core/ui/toast-store'
import type { ExchangeUser } from '@/data/exchange-user/exchange-user-model'
import {
  banState,
  visibleBanKinds,
  type BanKind,
} from '@/data/exchange-user/user-ban'
import type { UserSecurity } from '@/data/exchange-user/user-security-model'
import { useSetBan } from '@/hooks/use-user-security'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { UserBanReason } from './user-ban-reason'

const text = messages.users.ban

const ICON: Record<BanKind, AppIconName> = {
  withdraw: 'wallet',
  trade: 'trading',
  futures: 'chart',
}

/**
 * Вэбийн "Withdraw / Trade / Futures Status" товчнууд. Switch асаалттай =
 * идэвхтэй; солих бүрд шалтгаан заавал (§1.5).
 */
export function UserBanCard({
  user,
  security,
}: {
  user: ExchangeUser
  security: UserSecurity | undefined
}) {
  const setBan = useSetBan(user.id)
  const [pending, setPending] = useState<BanKind | null>(null)

  const state = banState(user, security)
  const kinds = visibleBanKinds(user)
  const frozen = kinds.filter((kind) => state[kind])

  const willFreeze = pending ? !state[pending] : false
  const label = pending ? text[pending] : ''

  return (
    <View className="gap-2">
      <SectionHeader title={text.title} />

      {frozen.length > 0 ? (
        <View className="flex-row items-center gap-2 rounded-lg bg-destructive-subtle px-3 py-2">
          <AppIcon name="warning" size={iconSize.sm} tone="muted" />
          <AppText variant="caption" className="flex-1 text-destructive">
            {text.frozenBanner}: {frozen.map((kind) => text[kind]).join(', ')}
          </AppText>
        </View>
      ) : null}

      <AppCard className="gap-3">
        {kinds.map((kind) => (
          <View key={kind} className="gap-2">
            <ToggleRow
              icon={ICON[kind]}
              title={text[kind]}
              hint={state[kind] ? text.frozen : text.active}
              value={!state[kind]}
              onChange={() => setPending(kind)}
            />
            {state[kind] ? <UserBanReason user={user} kind={kind} /> : null}
          </View>
        ))}
      </AppCard>

      <ConfirmSheet
        visible={pending !== null}
        title={`${label}: ${willFreeze ? text.freezeTitle : text.openTitle}`}
        description={
          pending === 'withdraw' && !willFreeze
            ? `${user.email}\n\n${text.withdrawOpenWarning}`
            : user.email
        }
        reason={{
          label: text.reason,
          required: true,
          placeholder: text.reasonPlaceholder,
        }}
        destructive={willFreeze}
        onCancel={() => setPending(null)}
        onConfirm={async (reason) => {
          if (!pending) return
          await setBan.mutateAsync({
            kind: pending,
            isBan: willFreeze,
            reason: reason ?? '',
          })
          toast.success(messages.common.done)
          setPending(null)
        }}
      />
    </View>
  )
}
