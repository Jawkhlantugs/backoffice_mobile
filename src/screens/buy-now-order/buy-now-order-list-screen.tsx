import { useState } from 'react'

import { ListFilterSheet, PagedListScreen, TextButton } from '@/components'
import {
  BUY_NOW_STATUSES,
  type BuyNowStatus,
} from '@/data/buy-now-order/buy-now-order-model'
import { useBuyNowOrders } from '@/hooks/use-buy-now-orders'
import { activeFilterCount, type ListFilters } from '@/lib/list-filters'
import { messages } from '@/lib/messages'

import { useBuyNowOrderRecord } from './use-buy-now-order-record'

const ALL = 'all'
const text = messages.finance

export function BuyNowOrderListScreen() {
  const record = useBuyNowOrderRecord()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BuyNowStatus | typeof ALL>(ALL)
  const [filters, setFilters] = useState<ListFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)
  const list = useBuyNowOrders({
    search,
    status: status === ALL ? undefined : status,
    filters,
  })
  const activeCount = activeFilterCount(filters)

  return (
    <>
      <PagedListScreen
        title={text.buyNowOrders.title}
        subtitle={text.buyNowOrders.subtitle}
        list={list}
        keyExtractor={(item) => item.id}
        emptyIcon="crypto"
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
            ...BUY_NOW_STATUSES.map((value) => ({
              value,
              label: text.buyNowStatuses[value],
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
          title: text.fields.orderId,
          amount: text.fields.payAmountFiat,
        }}
      />
      {/* Вэбийн `BUY_NOW_FILTER_FIELDS` — статус чип дээр. */}
      <ListFilterSheet
        visible={filterOpen}
        fields={[
          {
            key: 'cryptoCurrency',
            label: text.fields.currency,
            placeholder: `${text.filters.example} USDT`,
            autoCapitalize: 'characters',
          },
          { key: 'orderId', label: text.fields.orderId },
        ]}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}
