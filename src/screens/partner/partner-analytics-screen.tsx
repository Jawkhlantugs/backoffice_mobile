import { View } from 'react-native'

import {
  AppCard,
  AppText,
  ProgressBar,
  SectionHeader,
  StatCard,
  StateView,
  SummaryScreen,
} from '@/components'
import { formatAmountSafe } from '@/core/money/format'
import type { ReferralFunnel } from '@/data/partner/partner-model'
import { usePartnerAnalytics } from '@/hooks/use-partners'
import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'

const text = messages.partner
const PERCENT = 100

const funnelSteps = (funnel: ReferralFunnel) => [
  {
    key: 'registrations',
    label: text.funnelSteps.registrations,
    value: funnel.registrations,
  },
  { key: 'deposits', label: text.funnelSteps.deposits, value: funnel.deposits },
  { key: 'traders', label: text.funnelSteps.traders, value: funnel.traders },
]

/** Вэбийн "Commission Trend" нь өгөгдөлгүй placeholder тул энд байхгүй. */
export function PartnerAnalyticsScreen() {
  const { summary, funnel, top } = usePartnerAnalytics()
  const stats = summary.data
  const steps = funnel.data ? funnelSteps(funnel.data) : []
  const max = Math.max(1, ...steps.map((step) => step.value))

  return (
    <SummaryScreen
      title={text.analytics.title}
      subtitle={text.analytics.subtitle}
      onRefresh={() =>
        Promise.all([summary.refetch(), funnel.refetch(), top.refetch()])
      }
    >
      <StateView error={summary.error} onRetry={() => void summary.refetch()}>
        <View className="gap-3">
          <View className="flex-row gap-3">
            <StatCard
              label={text.totalPartners}
              value={stats?.totalPartners ?? '—'}
              icon="partner"
              loading={summary.isPending}
            />
            <StatCard
              label={text.activePartners}
              value={stats?.activePartners ?? '—'}
              icon="userCheck"
              loading={summary.isPending}
            />
          </View>
          <View className="flex-row gap-3">
            <StatCard
              label={text.totalCommissions}
              value={
                stats
                  ? formatAmountSafe(
                      stats.totalCommissions.raw,
                      stats.totalCommissions.currency,
                    )
                  : '—'
              }
              icon="percent"
              loading={summary.isPending}
            />
            <StatCard
              label={text.pendingPayouts}
              value={stats?.pendingPayouts ?? '—'}
              icon="wallet"
              loading={summary.isPending}
            />
          </View>
        </View>
      </StateView>

      <View className="gap-2">
        <SectionHeader title={text.funnel} />
        <StateView
          loading={funnel.isPending}
          error={funnel.error}
          onRetry={() => void funnel.refetch()}
        >
          <AppCard className="gap-4">
            {steps.map((step) => (
              <View key={step.key} className="gap-1.5">
                <View className="flex-row justify-between">
                  <AppText variant="caption">{step.label}</AppText>
                  <AppText
                    variant="caption"
                    numeric
                    className="text-foreground"
                  >
                    {step.value.toLocaleString()}
                  </AppText>
                </View>
                <ProgressBar percent={(step.value / max) * PERCENT} />
              </View>
            ))}
          </AppCard>
        </StateView>
      </View>

      <View className="gap-2">
        <SectionHeader title={text.topPartners} />
        <StateView
          loading={top.isPending}
          error={top.error}
          isEmpty={(top.data ?? []).length === 0}
          emptyIcon="partner"
          onRetry={() => void top.refetch()}
        >
          <AppCard className="gap-0 p-0">
            {(top.data ?? []).map((partner, index) => (
              <View
                key={partner.id}
                className={cn(
                  'flex-row items-center gap-3 px-4 py-3',
                  index > 0 && 'border-t border-border',
                )}
              >
                <AppText variant="caption" numeric className="w-6">
                  {index + 1}
                </AppText>
                <View className="flex-1 gap-0.5">
                  <AppText variant="body" numberOfLines={1}>
                    {partner.email ?? partner.name ?? partner.id}
                  </AppText>
                  <AppText variant="caption" numberOfLines={1}>
                    {[
                      partner.referralCode,
                      `${partner.totalReferrals} ${text.fields.referrals}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </AppText>
                </View>
                <AppText variant="body" numeric>
                  {formatAmountSafe(
                    partner.totalEarnings.raw,
                    partner.totalEarnings.currency,
                  )}
                </AppText>
              </View>
            ))}
          </AppCard>
        </StateView>
      </View>
    </SummaryScreen>
  )
}
