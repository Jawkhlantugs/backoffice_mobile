import { useState } from 'react'
import { useRouter } from 'expo-router'

import { ListFilterSheet, RecordListScreen, TextButton } from '@/components'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import {
  ORDER_STATUSES,
  type OrderMarket,
  type OrderStatus,
} from '@/data/finance-order/finance-order-model'
import { useFinanceOrders } from '@/hooks/use-finance-orders'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { activeFilterCount, type ListFilters } from '@/lib/list-filters'
import { messages } from '@/lib/messages'

import { financeOrderRecord } from './finance-order-record'

const ALL = 'all'
const text = messages.finance

const TITLES: Record<OrderMarket, { title: string; subtitle: string }> = {
  usdt: messages.finance.orderUsdt,
  mnt: messages.finance.orderMnt,
}

export function FinanceOrderListScreen({ market }: { market: OrderMarket }) {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrderStatus | typeof ALL>(ALL)
  const [filters, setFilters] = useState<ListFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)

  const query = useFinanceOrders(market, {
    search,
    status: status === ALL ? undefined : status,
    filters,
  })
  const activeCount = activeFilterCount(filters)
  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <>
      <RecordListScreen
        title={TITLES[market].title}
        subtitle={TITLES[market].subtitle}
        leading={
          openDrawer
            ? {
                icon: 'menu',
                label: messages.nav.openMenu,
                onPress: openDrawer,
              }
            : {
                icon: 'back',
                label: messages.nav.back,
                onPress: () => router.back(),
              }
        }
        headerActions={[
          {
            icon: 'filter',
            label: text.filters.open,
            onPress: () => setFilterOpen(true),
          },
          {
            icon: 'refresh',
            label: messages.common.refresh,
            onPress: () => query.refetch(),
          },
        ]}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: text.orderSearchPlaceholder,
        }}
        statusChips={{
          chips: [
            { value: ALL, label: messages.common.all },
            ...ORDER_STATUSES.map((value) => ({
              value,
              label: text.orderStatuses[value],
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
        items={items}
        keyExtractor={(item) => item.orderId}
        record={financeOrderRecord}
        tableLabels={{ title: messages.finance.fields.symbol }}
        loading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
        refreshing={refresh.refreshing}
        onRefresh={refresh.onRefresh}
        emptyIcon="transaction"
        emptyLabel={messages.finance.empty}
      />
      {/* Вэбийн `ORDER_USDT_FILTER_FIELDS` — статус чип дээр; limit нь 20 тогтмол. */}
      <ListFilterSheet
        visible={filterOpen}
        fields={[
          { key: 'orderId', label: text.fields.orderId },
          {
            key: 'limit',
            label: text.filters.limit,
            placeholder: `${text.filters.example} 20`,
            keyboardType: 'number-pad',
            numeric: true,
          },
        ]}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}
