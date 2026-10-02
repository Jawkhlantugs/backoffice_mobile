import { useState } from 'react'
import { View } from 'react-native'

import {
  AmountText,
  AppCard,
  AppText,
  FilterChips,
  ProgressBar,
  SectionHeader,
  StatCard,
  StateView,
  SummaryScreen,
} from '@/components'
import { formatAmountSafe, type AmountField } from '@/core/money/format'
import { useDashboard } from '@/hooks/use-dashboard'
import { cn } from '@/lib/cn'
import { compareDecimal } from '@/lib/compare-decimal'
import type { RangePeriod } from '@/lib/date-range'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'
import { DEFAULT_PERIOD, periodChips } from '@/lib/period-chips'

const text = messages.dashboard
const PERCENT = 100

const money = (amount: AmountField) =>
  formatAmountSafe(amount.raw, amount.currency)

/**
 * Зөвхөн харуулах харьцаа (явцын зурааст) — дүнг тооцоонд биш, зураасны
 * уртад л `Number` болгоно.
 */
function share(amount: AmountField, max: AmountField): number {
  const value = Number(amount.raw)
  const top = Number(max.raw)
  return top > 0 ? (value / top) * PERCENT : 0
}

/** Вэбийн Overview таб: KPI ба орлогын эх үүсвэр. Бусад 6 таб вэб дээр. */
export function DashboardScreen() {
  const [period, setPeriod] = useState<RangePeriod>(DEFAULT_PERIOD)
  const { summary, revenue } = useDashboard(period)
  const stats = summary.data
  const sources = [...(revenue.data ?? [])].sort(
    (a, b) => compareDecimal(String(b.amount.raw), String(a.amount.raw)) ?? 0,
  )
  const top = sources[0]?.amount

  return (
    <SummaryScreen
      title={text.title}
      subtitle={text.subtitle}
      onRefresh={() => Promise.all([summary.refetch(), revenue.refetch()])}
    >
      <FilterChips chips={periodChips()} value={period} onChange={setPeriod} />

      <StateView
        loading={summary.isPending}
        error={summary.error}
        onRetry={() => void summary.refetch()}
      >
        {stats ? (
          <View className="gap-3">
            <View className="flex-row gap-3">
              <StatCard
                label={`${text.totalUsers} · +${stats.newUsers} ${text.newUsers}`}
                value={stats.totalUsers.toLocaleString()}
                icon="users"
              />
              <StatCard
                label={text.activeUsers}
                value={stats.activeUsers.toLocaleString()}
                icon="userCheck"
              />
            </View>
            <View className="flex-row gap-3">
              <StatCard
                label={text.bankConnected}
                value={stats.bankConnectedUsers.toLocaleString()}
                icon="bank"
              />
              <StatCard
                label={text.arpu}
                value={money(stats.arpu)}
                icon="chart"
              />
            </View>
            <AppCard className="gap-3">
              {[
                { label: text.revenue, amount: stats.revenue },
                { label: text.tradeVolume, amount: stats.tradeVolume },
                { label: text.userMnt, amount: stats.userMntBalance },
              ].map((row) => (
                <View key={row.label} className="gap-0.5">
                  <AppText variant="caption">{row.label}</AppText>
                  <AmountText amount={row.amount} variant="title" />
                </View>
              ))}
            </AppCard>
          </View>
        ) : null}
      </StateView>

      <View className="gap-2">
        <SectionHeader title={text.revenueSources} />
        <StateView
          loading={revenue.isPending}
          error={revenue.error}
          isEmpty={sources.length === 0}
          emptyIcon="chart"
          onRetry={() => void revenue.refetch()}
        >
          <AppCard className="gap-0 py-1">
            {sources.map((row, index) => (
              <View
                key={row.source}
                className={cn(
                  'gap-1.5 py-2.5',
                  index > 0 && 'border-t border-border',
                )}
              >
                <View className="flex-row justify-between">
                  <AppText variant="caption">
                    {labelOf(text.sources, row.source)}
                  </AppText>
                  <AmountText
                    amount={row.amount}
                    variant="caption"
                    className="text-foreground"
                  />
                </View>
                <ProgressBar percent={top ? share(row.amount, top) : 0} />
              </View>
            ))}
          </AppCard>
        </StateView>
      </View>

      <AppText variant="caption">{text.chartsHint}</AppText>
    </SummaryScreen>
  )
}
