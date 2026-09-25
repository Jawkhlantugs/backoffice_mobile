import { View } from 'react-native'

import {
  AmountText,
  AppCard,
  AppText,
  SectionHeader,
  StateView,
} from '@/components'
import type { BalanceItem } from '@/data/exchange-user/user-balance-model'
import { useUserBalance } from '@/hooks/use-user-balance'
import { messages } from '@/lib/messages'

function BalanceRow({ item }: { item: BalanceItem }) {
  return (
    <View className="flex-row items-center justify-between py-1.5">
      <AppText variant="body">{item.asset}</AppText>
      <View className="items-end">
        <AmountText amount={item.free} variant="body" />
        <AmountText amount={item.usdtValuation} variant="tiny" />
      </View>
    </View>
  )
}

function BalanceGroup({
  title,
  items,
}: {
  title: string
  items: BalanceItem[]
}) {
  if (items.length === 0) return null
  return (
    <AppCard className="gap-1">
      <SectionHeader title={title} />
      {items.map((item) => (
        <BalanceRow key={item.asset} item={item} />
      ))}
    </AppCard>
  )
}

export function UserAssetsTab({ uid }: { uid: string }) {
  const query = useUserBalance(uid)
  const balance = query.data

  return (
    <StateView
      loading={query.isPending}
      error={query.error}
      onRetry={() => query.refetch()}
    >
      {balance ? (
        <View className="gap-3">
          <AppCard className="flex-row items-center justify-between">
            <AppText variant="label">{messages.users.assets.total}</AppText>
            <View className="items-end">
              <AmountText amount={balance.totalUsdtValuation} variant="title" />
              <AmountText
                amount={balance.totalMntValuation}
                variant="caption"
              />
            </View>
          </AppCard>

          <BalanceGroup
            title={messages.users.assets.spot}
            items={balance.spot}
          />
          <BalanceGroup
            title={messages.users.assets.futures}
            items={balance.futures}
          />
          <BalanceGroup
            title={messages.users.assets.fiat}
            items={balance.fiat}
          />

          {balance.spot.length === 0 &&
          balance.futures.length === 0 &&
          balance.fiat.length === 0 ? (
            <AppText variant="caption" className="text-center">
              {messages.users.assets.empty}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </StateView>
  )
}
