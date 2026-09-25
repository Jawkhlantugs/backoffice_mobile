import { useState } from 'react'
import { useRouter } from 'expo-router'

import { RecordListScreen } from '@/components'
import type { OrderMarket } from '@/data/finance-order/finance-order-model'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useFinanceOrders } from '@/hooks/use-finance-orders'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { OrderCard } from './order-card'

const TITLES: Record<OrderMarket, { title: string; subtitle: string }> = {
  usdt: messages.finance.orderUsdt,
  mnt: messages.finance.orderMnt,
}

export function FinanceOrderListScreen({ market }: { market: OrderMarket }) {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const [search, setSearch] = useState('')

  const query = useFinanceOrders(market, { search })
  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <RecordListScreen
      title={TITLES[market].title}
      subtitle={TITLES[market].subtitle}
      leading={
        openDrawer
          ? { icon: 'menu', label: messages.nav.openMenu, onPress: openDrawer }
          : {
              icon: 'back',
              label: messages.nav.back,
              onPress: () => router.back(),
            }
      }
      headerActions={[
        {
          icon: 'refresh',
          label: messages.common.refresh,
          onPress: () => query.refetch(),
        },
      ]}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      items={items}
      keyExtractor={(item) => item.orderId}
      renderItem={({ item }) => <OrderCard order={item} />}
      loading={query.isPending}
      error={query.error}
      onRetry={() => query.refetch()}
      refreshing={refresh.refreshing}
      onRefresh={refresh.onRefresh}
      emptyIcon="transaction"
      emptyLabel={messages.finance.empty}
    />
  )
}
