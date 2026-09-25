import { useState } from 'react'

import { PagedListScreen } from '@/components'
import { useBuyNowOrders } from '@/hooks/use-buy-now-orders'
import { messages } from '@/lib/messages'

import { BuyNowOrderCard } from './buy-now-order-card'

export function BuyNowOrderListScreen() {
  const [search, setSearch] = useState('')
  const list = useBuyNowOrders({ search })

  return (
    <PagedListScreen
      title={messages.finance.buyNowOrders.title}
      subtitle={messages.finance.buyNowOrders.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="crypto"
      emptyLabel={messages.finance.empty}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <BuyNowOrderCard order={item} />}
    />
  )
}
