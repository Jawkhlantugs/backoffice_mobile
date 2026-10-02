import { RefreshControl, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'

import {
  AppHeader,
  AppText,
  Avatar,
  EmptyState,
  Screen,
  SectionHeader,
  StatCard,
  StateView,
  useTabBarInset,
} from '@/components'
import type {
  LeaveRequest,
  LeaveStatus,
} from '@/data/leave-request/leave-request-model'
import { useDemoStore } from '@/core/demo/demo-mode'
import { LEAVE_MENU_PATH } from '@/core/navigation/menu-items'
import { hasMenuPath } from '@/core/navigation/menu-view'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { isOfficePrivileged } from '@/core/session/privileges'
import { useSessionStore } from '@/core/session/session-store'
import { useAdminMenu } from '@/hooks/use-admin-menu'
import { useLeaveRequests } from '@/hooks/use-leave-requests'
import { usePullRefresh } from '@/hooks/use-pull-refresh'
import { messages } from '@/lib/messages'
import { useAppColors } from '@/theme/use-theme'

import { LeaveRequestCard } from '@/screens/leave/leave-request-card'

import { DemoNotice } from './demo-notice'
import { QuickAction } from './quick-action'

const RECENT_LIMIT = 3
const MORNING_UNTIL = 12
const EVENING_FROM = 18

/** Цагаас хамаарсан мэндчилгээ — өдрийн турш нэг өгүүлбэр давтагдахгүй. */
function greeting(): string {
  const hour = new Date().getHours()
  if (hour < MORNING_UNTIL) return messages.home.greetingMorning
  if (hour >= EVENING_FROM) return messages.home.greetingEvening
  return messages.home.greetingDay
}

/**
 * Нүүр = өнөөдөр юу хийх вэ. Тоон хайрцаг, түргэн үйлдэл, батлах хүлээж буй
 * хүсэлтүүд. Бүх модулийн жагсаалт нь Цэс табд ба drawer-т.
 */
export function HomeScreen() {
  const router = useRouter()
  const openDrawer = useDrawerToggle()
  const user = useSessionStore((store) => store.user)
  const isDemo = useDemoStore((store) => store.active)
  const menu = useAdminMenu()
  const { colors } = useAppColors()

  const canUseLeave = user ? hasMenuPath(user.menu, LEAVE_MENU_PATH) : false
  const canReview = canUseLeave && isOfficePrivileged(user)

  const review = useLeaveRequests({ status: 'PENDING', enabled: canReview })
  const mine = useLeaveRequests({ adminUserId: user?.id, enabled: canUseLeave })

  const reviewItems = review.data?.items ?? []
  const myItems = mine.data?.items ?? []
  // Батлах эрхгүй ажилтанд бусдын хүсэлт биш, өөрийнх нь сүүлийн хүсэлтүүд.
  const recent = canReview ? review : mine
  const recentItems = canReview ? reviewItems : myItems

  const tabBarInset = useTabBarInset()
  // `refetch` нь `enabled: false`-г үл тоодог — эрхгүй query-г татахгүй.
  const refresh = usePullRefresh(() =>
    Promise.all([
      canReview ? review.refetch() : null,
      canUseLeave ? mine.refetch() : null,
    ]),
  )

  return (
    <Screen edges={['top']} padded={false}>
      <ScrollView
        contentContainerClassName="gap-6 px-4"
        contentContainerStyle={{ paddingBottom: tabBarInset }}
        refreshControl={
          <RefreshControl
            refreshing={refresh.refreshing}
            onRefresh={refresh.onRefresh}
            tintColor={colors.mutedForeground}
          />
        }
      >
        <AppHeader
          title={greeting()}
          subtitle={user?.email ?? undefined}
          leading={
            openDrawer
              ? {
                  icon: 'menu',
                  label: messages.nav.openMenu,
                  onPress: openDrawer,
                }
              : undefined
          }
          right={<Avatar source={user?.email} />}
        />

        {isDemo ? <DemoNotice /> : null}

        {canUseLeave ? (
          <View className="gap-3">
            <SectionHeader title={messages.home.myWork} />

            <View className="flex-row gap-3">
              {canReview ? (
                <StatCard
                  label={messages.home.pendingLeave}
                  value={reviewItems.length}
                  icon="leave"
                  loading={review.isPending}
                  onPress={() => router.push('/leave')}
                />
              ) : null}
              <StatCard
                label={messages.home.myLeave}
                value={myItems.length}
                icon="work"
                loading={mine.isPending}
                onPress={() => router.push('/leave')}
              />
            </View>

            <View className="flex-row gap-3">
              <StatCard
                label={messages.home.approved}
                value={countByStatus(myItems, 'APPROVED')}
                icon="checkCircle"
                loading={mine.isPending}
              />
              <StatCard
                label={messages.home.rejected}
                value={countByStatus(myItems, 'REJECTED')}
                icon="cancel"
                loading={mine.isPending}
              />
            </View>
          </View>
        ) : null}

        <View className="gap-3">
          <SectionHeader title={messages.home.quickActions} />

          <View className="flex-row gap-3">
            {canUseLeave ? (
              <QuickAction
                label={messages.home.newLeave}
                icon="add"
                onPress={() => router.push('/leave/new')}
              />
            ) : null}
            <QuickAction
              label={messages.home.allModules}
              icon="modules"
              onPress={() => router.push('/menu')}
            />
            <QuickAction
              label={messages.profile.title}
              icon="profile"
              onPress={() => router.push('/profile')}
            />
          </View>
        </View>

        {canUseLeave ? (
          <View className="gap-3">
            <SectionHeader
              title={messages.home.recentLeave}
              action={{
                label: messages.home.seeAll,
                onPress: () => router.push('/leave'),
              }}
            />

            <StateView
              loading={recent.isPending}
              error={recent.error}
              isEmpty={recentItems.length === 0}
              emptyIcon="checkCircle"
              emptyLabel={
                canReview ? messages.home.noPending : messages.home.noMine
              }
              emptyHint={
                canReview ? messages.home.noPendingHint : messages.home.noMineHint
              }
              onRetry={() => recent.refetch()}
            >
              <View className="gap-3">
                {recentItems.slice(0, RECENT_LIMIT).map((item) => (
                  <LeaveRequestCard
                    key={item.id}
                    request={item}
                    onPress={() => router.push(`/leave/${item.id}`)}
                  />
                ))}
              </View>
            </StateView>
          </View>
        ) : (
          <EmptyState
            icon="lock"
            title={messages.nav.noAccess}
            description={messages.nav.noAccessHint}
          />
        )}

        <AppText variant="tiny" className="text-center">
          {`${menu.ready}/${menu.total} · ${messages.nav.readyCount}`}
        </AppText>
      </ScrollView>
    </Screen>
  )
}

function countByStatus(
  items: readonly LeaveRequest[],
  status: LeaveStatus,
): number {
  return items.filter((item) => item.status === status).length
}
