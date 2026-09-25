import { useState } from 'react'
import Constants from 'expo-constants'
import { ScrollView, View } from 'react-native'

import {
  AppButton,
  AppCard,
  AppHeader,
  AppIcon,
  AppText,
  Avatar,
  ConfirmSheet,
  InfoRow,
  Screen,
  SectionHeader,
  SegmentedControl,
  StatusPill,
  ToggleRow,
  useTabBarInset,
} from '@/components'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useSessionStore } from '@/core/session/session-store'
import { useAdminMenu } from '@/hooks/use-admin-menu'
import { useBiometricLock } from '@/hooks/use-biometric-lock'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'
import { useThemeStore, type ThemePreference } from '@/theme/theme-preference'

export function ProfileScreen() {
  const tabBarInset = useTabBarInset()
  const openDrawer = useDrawerToggle()
  const user = useSessionStore((store) => store.user)
  const signOut = useSessionStore((store) => store.signOut)
  const preference = useThemeStore((store) => store.preference)
  const setPreference = useThemeStore((store) => store.set)
  const menu = useAdminMenu()
  const biometric = useBiometricLock()

  const [confirming, setConfirming] = useState(false)

  const displayName = user?.name ?? user?.email?.split('@')[0] ?? '—'

  return (
    <Screen edges={['top']} padded={false}>
      <ScrollView
        contentContainerClassName="gap-6 px-4"
        contentContainerStyle={{ paddingBottom: tabBarInset }}
      >
        <AppHeader
          title={messages.profile.title}
          leading={
            openDrawer
              ? {
                  icon: 'menu',
                  label: messages.nav.openMenu,
                  onPress: openDrawer,
                }
              : undefined
          }
        />

        <AppCard className="items-center gap-3 py-6">
          <Avatar source={user?.email} size="lg" />
          <View className="items-center gap-0.5">
            <AppText variant="title">{displayName}</AppText>
            <AppText variant="caption">{user?.email ?? '—'}</AppText>
          </View>
          <StatusPill label={menu.activeTeamInfo.name} tone="info" />
        </AppCard>

        <View className="gap-3">
          <SectionHeader title={messages.profile.account} />
          <AppCard className="gap-3">
            <InfoRow
              label={messages.profile.email}
              value={user?.email ?? '—'}
            />
            <InfoRow
              label={messages.profile.department}
              value={user?.name ?? '—'}
            />
            <InfoRow
              label={messages.profile.menuCount}
              value={`${menu.ready}/${menu.total}`}
            />
          </AppCard>
        </View>

        <View className="gap-3">
          <SectionHeader title={messages.profile.appearance} />
          <SegmentedControl<ThemePreference>
            value={preference}
            onChange={(next) => {
              void setPreference(next)
            }}
            options={[
              {
                value: 'dark',
                label: messages.theme.dark,
                icon: 'themeDark',
              },
              {
                value: 'light',
                label: messages.theme.light,
                icon: 'themeLight',
              },
              {
                value: 'system',
                label: messages.theme.system,
                icon: 'themeAuto',
              },
            ]}
          />
        </View>

        <View className="gap-3">
          <SectionHeader title={messages.profile.security} />

          <AppCard>
            <ToggleRow
              icon="biometric"
              title={messages.profile.biometric}
              hint={
                biometric.available
                  ? messages.profile.biometricHint
                  : messages.profile.biometricUnavailable
              }
              value={biometric.enabled}
              disabled={!biometric.available || biometric.busy}
              onChange={(next) => {
                void biometric.toggle(next)
              }}
            />
          </AppCard>

          <AppCard className="flex-row items-center gap-3">
            <AppIcon name="lock" size={iconSize.md} tone="muted" />
            <AppText variant="caption" className="flex-1">
              {messages.profile.dataHint}
            </AppText>
          </AppCard>
        </View>

        <AppButton
          label={messages.auth.signOut}
          variant="secondary"
          icon="signOut"
          onPress={() => setConfirming(true)}
        />

        <AppText variant="tiny" className="text-center">
          {`${messages.profile.version} ${Constants.expoConfig?.version ?? '—'}`}
        </AppText>
      </ScrollView>

      <ConfirmSheet
        visible={confirming}
        title={messages.profile.signOutTitle}
        description={messages.profile.signOutDescription}
        confirmLabel={messages.auth.signOut}
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          setConfirming(false)
          await signOut()
        }}
      />
    </Screen>
  )
}
