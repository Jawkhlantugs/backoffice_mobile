import { useState } from 'react'

import { ListFilterSheet, PagedListScreen, TextButton } from '@/components'
import {
  CONVERT_STATUSES,
  type ConvertStatus,
} from '@/data/convert/convert-model'
import { useConvertRecords } from '@/hooks/use-convert'
import { activeFilterCount, type ListFilters } from '@/lib/list-filters'
import { messages } from '@/lib/messages'

import { useConvertRecord } from './use-convert-record'

const ALL = 'all'
const text = messages.finance

export function ConvertListScreen() {
  const record = useConvertRecord()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ConvertStatus | typeof ALL>(ALL)
  const [filters, setFilters] = useState<ListFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)
  const list = useConvertRecords({
    search,
    status: status === ALL ? undefined : status,
    filters,
  })
  const activeCount = activeFilterCount(filters)

  return (
    <>
      <PagedListScreen
        title={text.convert.title}
        subtitle={text.convert.subtitle}
        list={list}
        keyExtractor={(item) => item.id}
        emptyIcon="convert"
        emptyLabel={text.empty}
        headerActions={[
          {
            icon: 'filter',
            label: text.filters.open,
            onPress: () => setFilterOpen(true),
          },
        ]}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: text.searchPlaceholder,
        }}
        statusChips={{
          chips: [
            { value: ALL, label: messages.common.all },
            ...CONVERT_STATUSES.map((value) => ({
              value,
              label: text.convertStatuses[value],
            })),
          ],
          value: status,
          onChange: setStatus,
        }}
        filters={
          activeCount > 0 ? (
            <TextButton
              label={`${text.filters.clear} (${activeCount})`}
              onPress={() => setFilters({})}
              className="self-start"
            />
          ) : undefined
        }
        record={record}
        tableLabels={{
          title: text.fields.toTxnId,
          amount: text.fields.toAmount,
        }}
      />
      {/* Вэбийн `CONVERT_FILTER_FIELDS` — статус чип дээр. */}
      <ListFilterSheet
        visible={filterOpen}
        fields={[
          {
            key: 'fromAsset',
            label: text.fields.fromAsset,
            placeholder: `${text.filters.example} USDT`,
            autoCapitalize: 'characters',
          },
          {
            key: 'toAsset',
            label: text.fields.toAsset,
            placeholder: `${text.filters.example} MNT`,
            autoCapitalize: 'characters',
          },
        ]}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}
