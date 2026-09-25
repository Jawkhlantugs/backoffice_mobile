import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useConvertRecords } from '@/hooks/use-convert'
import { messages } from '@/lib/messages'

import { ConvertCard } from './convert-card'

export function ConvertListScreen() {
  const [search, setSearch] = useState('')
  const list = useConvertRecords({ search })

  return (
    <PagedListScreen
      title={messages.finance.convert.title}
      subtitle={messages.finance.convert.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="convert"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <ConvertCard record={item} />}
    />
  )
}
