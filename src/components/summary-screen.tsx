import { RefreshControl, ScrollView } from 'react-native'

import { useScreenLeading } from '@/core/navigation/use-screen-leading'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'
import { useAppColors } from '@/theme/use-theme'

import { AppHeader, type HeaderAction } from './app-header'
import { Screen } from './screen'

/**
 * Жагсаалт биш дэлгэц (статистик, тохиргооны утга, дэлгэрэнгүй) —
 * толгой (цэс/буцах + шинэчлэх), татаж шинэчлэх scroll. Агуулгаа дуудагч
 * өгнө.
 */
export function SummaryScreen({
  title,
  subtitle,
  onRefresh,
  headerActions = [],
  children,
}: {
  title: string
  subtitle?: string
  onRefresh: () => Promise<unknown>
  headerActions?: HeaderAction[]
  children: React.ReactNode
}) {
  const leading = useScreenLeading()
  const refresh = usePullRefresh(onRefresh)
  const { colors } = useAppColors()

  return (
    <Screen edges={['top']}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        actions={[
          ...headerActions,
          {
            icon: 'refresh',
            label: messages.common.refresh,
            onPress: () => void onRefresh(),
          },
        ]}
      />
      <ScrollView
        contentContainerClassName="gap-4 pb-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh.refreshing}
            onRefresh={refresh.onRefresh}
            tintColor={colors.mutedForeground}
          />
        }
      >
        {children}
      </ScrollView>
    </Screen>
  )
}
