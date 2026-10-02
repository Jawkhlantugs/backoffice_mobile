import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useConvertRecords } from '@/hooks/use-convert'
import { messages } from '@/lib/messages'

import { useConvertRecord } from './use-convert-record'

export function ConvertListScreen() {
  const record = useConvertRecord()
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
      record={record}
    />
  )
}
