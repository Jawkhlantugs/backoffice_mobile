import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
import type { WithdrawBan } from '@/data/crypto-registry/crypto-registry-model'
import { useWithdrawBans } from '@/hooks/use-crypto-registry'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

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
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(item: WithdrawBan): React.ComponentProps<typeof RecordCard> {
  return {
    title: item.owner ?? item.id,
    subtitle: formatDate(item.createdAt),
    status: item.status
      ? { label: item.status, tone: statusTone(item.status) }
      : undefined,
    fields: [{ label: f.reason, value: item.reason }],
    details: [
      {
        label: f.start,
        value: item.startTime ? formatDate(item.startTime) : undefined,
      },
      {
        label: f.end,
        value: item.endTime ? formatDate(item.endTime) : undefined,
      },
    ],
  }
}
