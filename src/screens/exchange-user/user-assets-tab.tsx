import { useState } from 'react'
import { View } from 'react-native'

import { AppText, DateField, EmptyState, StateView } from '@/components'
import { useUserSnapshot } from '@/hooks/use-balance-snapshots'
import { useUserBalance } from '@/hooks/use-user-balance'
import { messages } from '@/lib/messages'

import { UserBalanceView } from './user-balance-view'

const text = messages.users.assets

function CurrentBalance({ uid }: { uid: string }) {
  const query = useUserBalance(uid)
  const balance = query.data

  return (
    <StateView
      loading={query.isPending}
      error={query.error}
      onRetry={() => query.refetch()}
    >
      {balance ? (
        <UserBalanceView
          usdt={balance.totalUsdtValuation}
          mnt={balance.totalMntValuation}
          spot={balance.spot}
          futures={balance.futures}
          fiat={balance.fiat}
        />
      ) : null}
    </StateView>
  )
}

function SnapshotBalance({ uid, date }: { uid: string; date: string }) {
  const query = useUserSnapshot(uid, date)
  const snapshot = query.data

  return (
    <StateView
      loading={query.isPending}
      error={query.error}
      onRetry={() => query.refetch()}
    >
      {snapshot ? (
        <UserBalanceView
          usdt={snapshot.usdtValuation}
          mnt={snapshot.mntValuation}
          spot={snapshot.spot}
          futures={snapshot.futures}
          fiat={snapshot.bank}
        />
      ) : (
        <EmptyState icon="history" title={text.noSnapshot} />
      )}
    </StateView>
  )
}

/** Вэбийн "Asset Snapshots List" — mobile-д өдрөөр нэгийг сонгож харна. */
export function UserAssetsTab({ uid }: { uid: string }) {
  const [date, setDate] = useState<string | null>(null)

  return (
    <View className="gap-3">
      <DateField
        label={text.date}
        value={date}
        onChange={setDate}
        quickPicks={['today', 'yesterday']}
        clearLabel={text.current}
      />
      {date === null ? (
        <AppText variant="caption">{text.currentHint}</AppText>
      ) : null}

      {date === null ? (
        <CurrentBalance uid={uid} />
      ) : (
        <SnapshotBalance uid={uid} date={date} />
      )}
    </View>
  )
}
