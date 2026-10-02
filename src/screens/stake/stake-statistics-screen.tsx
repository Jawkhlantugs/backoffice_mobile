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
import { useStakeStatistics } from '@/hooks/use-portal-extras'
import { cn } from '@/lib/cn'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.stakeStatistics
const PERCENT = 100

/** Вэбийн баганан графикийн утасны хэлбэр — статус бүр мөр + явцын зураас. */
export function StakeStatisticsScreen() {
  const query = useStakeStatistics()
  const stats = query.data
  const max = Math.max(1, ...(stats?.byStatus ?? []).map((row) => row.count))

  return (
    <SummaryScreen
      title={text.title}
      subtitle={text.subtitle}
      onRefresh={() => query.refetch()}
    >
      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={stats === null}
        emptyIcon="stake"
        onRetry={() => void query.refetch()}
      >
        {stats ? (
          <View className="gap-4">
            <View className="flex-row gap-3">
              <StatCard label={text.total} value={stats.total} icon="stake" />
              <StatCard
                label={text.active}
                value={stats.active}
                icon="checkCircle"
              />
              <StatCard
                label={text.failed}
                value={stats.failed}
                icon="warning"
              />
            </View>
            <View className="gap-2">
              <SectionHeader title={text.byStatus} />
              <AppCard className="gap-0 py-1">
                {stats.byStatus.map((row, index) => (
                  <View
                    key={row.status}
                    className={cn(
                      'gap-1.5 py-2.5',
                      index > 0 && 'border-t border-border',
                    )}
                  >
                    <View className="flex-row justify-between">
                      <AppText variant="caption">
                        {labelOf(messages.lists.stake.statuses, row.status)}
                      </AppText>
                      <AppText
                        variant="caption"
                        numeric
                        className="text-foreground"
                      >
                        {row.count}
                      </AppText>
                    </View>
                    <ProgressBar percent={(row.count / max) * PERCENT} />
                  </View>
                ))}
              </AppCard>
            </View>
          </View>
        ) : null}
      </StateView>
    </SummaryScreen>
  )
}
