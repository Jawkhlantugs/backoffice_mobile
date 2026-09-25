import { useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  AppCard,
  AppHeader,
  AppText,
  Screen,
  SectionHeader,
  StatCard,
} from '@/components'
import { formatAmountSafe } from '@/core/money/format'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import {
  useFuturesMasterRisk,
  useFuturesOpenOrders,
} from '@/hooks/use-futures-risk'
import { messages, translateUnknownError } from '@/lib/messages'

export function FuturesRiskScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()

  const riskQuery = useFuturesMasterRisk()
  const ordersQuery = useFuturesOpenOrders()

  const risk = riskQuery.data
  const orders = ordersQuery.data ?? []

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={messages.futures.riskTitle}
        subtitle={messages.futures.riskSubtitle}
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
        actions={[
          {
            icon: 'refresh',
            label: messages.common.refresh,
            onPress: () => {
              void riskQuery.refetch()
              void ordersQuery.refetch()
            },
          },
        ]}
      />

      <ScrollView contentContainerClassName="gap-4 pb-8">
        {riskQuery.error ? (
          <AppText variant="body" className="text-destructive">
            {translateUnknownError(riskQuery.error)}
          </AppText>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              label={messages.futures.walletBalance}
              value={
                risk
                  ? formatAmountSafe(
                      risk.totalWalletBalance.raw,
                      risk.totalWalletBalance.currency,
                    )
                  : ''
              }
              icon="wallet"
              loading={riskQuery.isPending}
            />
            <StatCard
              label={messages.futures.marginBalance}
              value={
                risk
                  ? formatAmountSafe(
                      risk.totalMarginBalance.raw,
                      risk.totalMarginBalance.currency,
                    )
                  : ''
              }
              icon="trading"
              loading={riskQuery.isPending}
            />
            <StatCard
              label={messages.futures.unrealizedProfit}
              value={
                risk
                  ? formatAmountSafe(
                      risk.totalUnrealizedProfit.raw,
                      risk.totalUnrealizedProfit.currency,
                    )
                  : ''
              }
              icon="transaction"
              loading={riskQuery.isPending}
            />
            <StatCard
              label={messages.futures.marginRatio}
              value={risk?.marginRatioPercent ?? '—'}
              icon="config"
              loading={riskQuery.isPending}
            />
          </View>
        )}

        <View className="gap-2">
          <SectionHeader title={messages.futures.positions} />
          {risk && risk.positions.length === 0 ? (
            <AppText variant="caption">
              {messages.futures.positionsEmpty}
            </AppText>
          ) : null}
          {risk?.positions.map((position) => (
            <AppCard
              key={`${position.symbol}-${position.positionSide ?? ''}`}
              className="gap-1"
            >
              <View className="flex-row items-center justify-between">
                <AppText variant="body" className="font-semibold">
                  {position.symbol}
                </AppText>
                <AppText variant="body" numeric>
                  {position.positionAmt}
                </AppText>
              </View>
              <View className="flex-row items-center justify-between">
                <AppText variant="tiny">
                  {position.leverage ? `${position.leverage}x` : ''}{' '}
                  {position.entryPrice ?? ''}
                </AppText>
                <AppText
                  variant="caption"
                  numeric
                  className={
                    Number(position.unrealizedProfit.raw) < 0
                      ? 'text-destructive'
                      : 'text-success'
                  }
                >
                  {formatAmountSafe(
                    position.unrealizedProfit.raw,
                    position.unrealizedProfit.currency,
                  )}
                </AppText>
              </View>
            </AppCard>
          ))}
        </View>

        <View className="gap-2">
          <SectionHeader title={messages.futures.openOrders} />
          {orders.length === 0 && !ordersQuery.isPending ? (
            <AppText variant="caption">
              {messages.futures.openOrdersEmpty}
            </AppText>
          ) : null}
          {orders.map((order) => (
            <AppCard key={order.orderId} className="gap-1">
              <View className="flex-row items-center justify-between">
                <AppText variant="body" className="font-semibold">
                  {order.symbol}
                </AppText>
                <AppText variant="tiny">{order.status}</AppText>
              </View>
              <AppText variant="caption">
                {order.side} · {order.type} · {order.price ?? ''}
              </AppText>
            </AppCard>
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}
