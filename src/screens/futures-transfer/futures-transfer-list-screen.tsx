import { useState } from 'react'
import { useRouter } from 'expo-router'

import { RecordListScreen, type FilterChip } from '@/components'
import type { FuturesTransferStatus } from '@/data/futures-transfer/futures-transfer-model'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useFuturesTransferRequests } from '@/hooks/use-futures-transfers'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'

import { FuturesTransferCard } from './futures-transfer-card'

type StatusFilter = FuturesTransferStatus | 'ALL'

const statusChips = (): FilterChip<StatusFilter>[] => [
  { value: 'ALL', label: messages.common.all },
  { value: 'PENDING', label: messages.futures.statuses.PENDING },
  { value: 'APPROVED', label: messages.futures.statuses.APPROVED },
  { value: 'REJECTED', label: messages.futures.statuses.REJECTED },
]

export function FuturesTransferListScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const [status, setStatus] = useState<StatusFilter>('ALL')

  const query = useFuturesTransferRequests(
    status === 'ALL' ? undefined : status,
  )
  const items = query.data?.items ?? []
  const refresh = usePullRefresh(() => query.refetch())

  return (
    <RecordListScreen
      title={messages.futures.transfersTitle}
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
      statusChips={{ chips: statusChips(), value: status, onChange: setStatus }}
      items={items}
      keyExtractor={(item) => item.txnId}
      renderItem={({ item }) => <FuturesTransferCard request={item} />}
      loading={query.isPending}
      error={query.error}
      onRetry={() => query.refetch()}
      refreshing={refresh.refreshing}
      onRefresh={refresh.onRefresh}
      emptyIcon="transfer"
      emptyLabel={messages.futures.transfersEmpty}
    />
  )
}
