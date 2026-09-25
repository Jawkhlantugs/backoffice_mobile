import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import type { DrawerContentComponentProps } from 'expo-router/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  AppIcon,
  AppText,
  Avatar,
  EmptyState,
  IconButton,
  SearchInput,
  SectionHeader,
} from '@/components'
import type { MenuEntry } from '@/core/navigation/menu-view'
import { useSessionStore } from '@/core/session/session-store'
import { useAdminMenu } from '@/hooks/use-admin-menu'
import { messages } from '@/lib/messages'
import { iconSize, spacing } from '@/theme/tokens'

import { DrawerMenuEntry } from './drawer-menu-entry'
import { TeamSwitcher } from './team-switcher'

/**
 * Вэб админы sidebar-ийн mobile хувилбар: баг сонгогч → бүлэг → цэсний мөр
 * гэсэн яг ижил шатлал, ижил нэрс. Цэс нь `/admin/admin-menus/my`-аас ирнэ —
 * эрхгүй мөр огт байхгүй (§1.7).
 */
export function DrawerContent({ navigation }: DrawerContentComponentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const user = useSessionStore((store) => store.user)

  const [query, setQuery] = useState('')
  const menu = useAdminMenu(query)

  function openEntry(entry: MenuEntry) {
    if (entry.route === null) return
    navigation.closeDrawer()
    router.push(entry.route)
  }

  return (
    <View
      className="flex-1 bg-elevated"
      style={{ paddingTop: insets.top + spacing.sm }}
    >
      <View className="gap-3 px-3 pb-3">
        <View className="flex-row items-center justify-between gap-2 px-1">
          <AppText variant="tiny" className="uppercase tracking-wider">
            {messages.nav.brand}
          </AppText>

          <IconButton
            icon="close"
            label={messages.nav.closeMenu}
            size="sm"
            onPress={() => navigation.closeDrawer()}
          />
        </View>

        <TeamSwitcher
          teams={menu.teams}
          activeTeam={menu.activeTeam}
          onSelect={menu.selectTeam}
        />

        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder={messages.nav.searchMenu}
        />
      </View>

      <ScrollView
        contentContainerClassName="gap-5 px-3 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        {menu.groups.length === 0 ? (
          <EmptyState
            icon={query.length > 0 ? 'search' : 'lock'}
            title={
              query.length > 0 ? messages.nav.noResults : messages.nav.noAccess
            }
            description={
              query.length > 0
                ? messages.nav.noResultsHint
                : messages.nav.noAccessHint
            }
          />
        ) : (
          menu.groups.map((group) => (
            <View key={group.id} className="gap-1">
              <SectionHeader title={group.title} className="px-2 pb-1" />
              {group.entries.map((entry) => (
                <DrawerMenuEntry
                  key={entry.id}
                  entry={entry}
                  activePath={pathname}
                  onNavigate={openEntry}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={messages.profile.title}
        onPress={() => {
          navigation.closeDrawer()
          router.push('/profile')
        }}
        className="flex-row items-center gap-3 border-t border-border px-4 pt-3"
        style={{ paddingBottom: insets.bottom + spacing.md }}
      >
        <Avatar source={user?.email} size="sm" />
        <View className="flex-1">
          <AppText variant="body" numberOfLines={1} className="font-medium">
            {user?.email ?? '—'}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {`${menu.ready}/${menu.total} · ${messages.nav.readyCount}`}
          </AppText>
        </View>
        <AppIcon name="settings" size={iconSize.md} tone="muted" />
      </Pressable>
    </View>
  )
}
