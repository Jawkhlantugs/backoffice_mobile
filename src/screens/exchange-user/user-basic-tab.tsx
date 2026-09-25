import { AppCard, InfoRow } from '@/components'
import type { ExchangeUser } from '@/data/exchange-user/exchange-user-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

export function UserBasicTab({ user }: { user: ExchangeUser }) {
  return (
    <AppCard className="gap-3">
      <InfoRow label={messages.users.email} value={user.email} />
      {user.binanceEmail ? (
        <InfoRow
          label={messages.users.binanceEmail}
          value={user.binanceEmail}
        />
      ) : null}
      {user.firstName || user.lastName ? (
        <InfoRow
          label={messages.users.name}
          value={[user.firstName, user.lastName].filter(Boolean).join(' ')}
        />
      ) : null}
      {user.subAccountId ? (
        <InfoRow
          label={messages.users.subAccountId}
          value={user.subAccountId}
        />
      ) : null}
      {user.kycLevel !== undefined ? (
        <InfoRow
          label={messages.users.kycLevel}
          value={String(user.kycLevel)}
        />
      ) : null}
      {user.vipLevel !== undefined ? (
        <InfoRow
          label={messages.users.vipLevel}
          value={String(user.vipLevel)}
        />
      ) : null}
      <InfoRow
        label={messages.users.createdAt}
        value={formatDate(user.createdAt)}
      />
    </AppCard>
  )
}
