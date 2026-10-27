import { useState } from 'react'

import { PagedListScreen, type RecordView, type StatusTone } from '@/components'
import type { WithdrawBan } from '@/data/crypto-registry/crypto-registry-model'
import { useWithdrawBans } from '@/hooks/use-crypto-registry'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function CryptoWithdrawBanListScreen() {
  const [search, setSearch] = useState('')
  const list = useWithdrawBans(search)

  return (
    <PagedListScreen
      title={text.cryptoWithdrawBans.title}
      subtitle={text.cryptoWithdrawBans.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="block"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.id }}
    />
  )
}

/** Вэбийн `withdraw-bans/constants.ts`-ийн `getStatusVariant`. */
function statusToneOf(status: string): StatusTone {
  if (status === 'CLEANED_BY_SYSTEM') return 'success'
  if (status === 'ACTIVE' || status === 'BANNED') return 'danger'
  return 'neutral'
}

/** Вэбийн `crypto/withdraw-bans/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.userId,
  f.userEmail,
  f.reason,
  'status',
  f.start,
  f.end,
] as const

function toCard(item: WithdrawBan): RecordView {
  return {
    title: item.owner ?? item.id,
    tableTitle: item.id,
    subtitle: formatDate(item.createdAt),
    status: item.status
      ? { label: item.status, tone: statusToneOf(item.status) }
      : undefined,
    fields: [
      { label: f.reason, value: item.reason },
      { label: f.userEmail, value: item.userEmail },
      {
        label: f.start,
        value: item.startTime ? formatDate(item.startTime) : undefined,
      },
      {
        label: f.end,
        value: item.endTime ? formatDate(item.endTime) : undefined,
      },
    ],
    details: [{ label: f.userId, value: item.userId }],
    columns: COLUMNS,
  }
}
