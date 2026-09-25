import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
import type { FuturesAccount } from '@/data/futures-account/futures-account-model'
import { useFuturesAccounts } from '@/hooks/use-futures-accounts'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function FuturesAccountListScreen() {
  const [search, setSearch] = useState('')
  const list = useFuturesAccounts(search)

  return (
    <PagedListScreen
      title={text.futuresAccounts.title}
      subtitle={text.futuresAccounts.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="users"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(item: FuturesAccount): React.ComponentProps<typeof RecordCard> {
  return {
    title: item.email,
    subtitle: formatDate(item.createdAt),
    fields: [{ label: f.role, value: item.role }],
    details: [
      { label: f.user, value: item.userId },
      { label: f.account, value: item.traderUserId },
    ],
  }
}
