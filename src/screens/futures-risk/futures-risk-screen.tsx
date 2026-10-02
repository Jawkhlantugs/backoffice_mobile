import { View } from 'react-native'

import {
  AppCard,
  AppText,
  Badge,
  InfoRow,
  SectionHeader,
  SummaryScreen,
} from '@/components'
import { formatMoney, type AmountField } from '@/core/money/format'
import { tryParseMoney } from '@/core/money/money'
import {
  useFuturesMasterRisk,
  useFuturesOpenOrders,
} from '@/hooks/use-futures-risk'
import { groupDigits } from '@/lib/group-digits'
import { messages, translateUnknownError } from '@/lib/messages'

import { RiskMetricCard, type MetricTone } from './risk-metric-card'

const text = messages.futures

/** Вэбийн `formatRiskValue`-тай ижил — 2 орон, доош тайрна. */
const RISK_DECIMALS = 2

function riskAmount(amount: AmountField): string {
  const money = tryParseMoney(amount.raw, amount.currency)
  return money
    ? formatMoney(money, { fractionDigits: RISK_DECIMALS })
    : String(amount.raw)
}

function pnlTone(amount: AmountField): MetricTone {
  const money = tryParseMoney(amount.raw, amount.currency)
  if (!money || money.minorUnits === 0n) return 'default'
  return money.minorUnits < 0n ? 'negative' : 'positive'
}

export function FuturesRiskScreen() {
  const riskQuery = useFuturesMasterRisk()
  const ordersQuery = useFuturesOpenOrders()

  const risk = riskQuery.data
  const orders = ordersQuery.data ?? []
  const loading = riskQuery.isPending

  return (
    <SummaryScreen
      title={text.riskTitle}
      subtitle={text.riskSubtitle}
      onRefresh={() =>
        Promise.all([riskQuery.refetch(), ordersQuery.refetch()])
      }
    >
      {riskQuery.error ? (
        <AppText variant="body" className="text-destructive">
          {translateUnknownError(riskQuery.error)}
        </AppText>
      ) : (
        <View className="gap-3">
          <RiskMetricCard
            label={text.walletBalance}
            icon="wallet"
            value={risk ? riskAmount(risk.totalWalletBalance) : ''}
            unit={risk?.totalWalletBalance.currency}
            loading={loading}
          />
          <RiskMetricCard
            label={text.marginBalance}
            icon="trading"
            value={risk ? riskAmount(risk.totalMarginBalance) : ''}
            unit={risk?.totalMarginBalance.currency}
            loading={loading}
          />
          <RiskMetricCard
            label={text.unrealizedProfit}
            icon="transaction"
            value={risk ? riskAmount(risk.totalUnrealizedProfit) : ''}
            unit={risk?.totalUnrealizedProfit.currency}
            tone={risk ? pnlTone(risk.totalUnrealizedProfit) : 'default'}
            loading={loading}
          />
          <RiskMetricCard
            label={text.marginRatio}
            icon="config"
            value={risk?.marginRatioPercent ?? '—'}
            unit={risk?.marginRatioPercent ? '%' : undefined}
            loading={loading}
          />
        </View>
      )}

      <View className="gap-2">
        <SectionHeader title={text.positions} />
        {risk && risk.positions.length === 0 ? (
          <AppText variant="caption">{text.positionsEmpty}</AppText>
        ) : null}
        {risk?.positions.map((position) => (
          <AppCard
            key={`${position.symbol}-${position.positionSide ?? ''}`}
            className="gap-2"
          >
            <View className="flex-row items-center justify-between gap-3">
              <AppText variant="bodyLarge" className="font-semibold">
                {position.symbol}
              </AppText>
              {position.leverage ? (
                <Badge value={`${position.leverage}x`} />
              ) : null}
            </View>

            <InfoRow
              label={text.positionSize}
              value={groupDigits(position.positionAmt)}
            />
            <InfoRow
              label={text.entryPrice}
              value={groupDigits(position.entryPrice)}
            />
            <InfoRow
              label={text.markPrice}
              value={groupDigits(position.markPrice)}
            />

            <View className="flex-row items-center justify-between gap-3">
              <AppText variant="label">{text.unrealizedProfit}</AppText>
              <AppText
                variant="body"
                numeric
                className={
                  pnlTone(position.unrealizedProfit) === 'negative'
                    ? 'font-semibold text-destructive'
                    : 'font-semibold text-success'
                }
              >
                {`${riskAmount(position.unrealizedProfit)} ${position.unrealizedProfit.currency}`}
              </AppText>
            </View>
          </AppCard>
        ))}
      </View>

      <View className="gap-2">
        <SectionHeader title={text.openOrders} />
        {orders.length === 0 && !ordersQuery.isPending ? (
          <AppText variant="caption">{text.openOrdersEmpty}</AppText>
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
    </SummaryScreen>
  )
}
