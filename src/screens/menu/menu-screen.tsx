import { useState } from 'react'
import { SectionList, View } from 'react-native'

import {
  AppHeader,
  EmptyState,
  Screen,
  SearchInput,
  SectionHeader,
  useTabBarInset,
} from '@/components'
import type { MenuEntry } from '@/core/navigation/menu-view'
import { useDrawerToggle } from '@/core/navigation/use-drawer-toggle'
import { useAdminMenu } from '@/hooks/use-admin-menu'
import { messages } from '@/lib/messages'
import { spacing } from '@/theme/tokens'

import { TeamSwitcher } from '@/screens/shell/team-switcher'

import { MenuModuleRow } from './menu-module-row'

/**
 * Дэд цэстэй мөрийг вэбийн sidebar шиг задална: эцэг мөр зөвхөн гарчиг бол
 * хүүхдүүд нь "Эцэг · Хүүхэд" гэсэн тусдаа мөр болно.
 */
function flatten(entries: MenuEntry[]): MenuEntry[] {
  return entries.flatMap((entry) =>
    entry.children.length === 0
      ? [entry]
      : entry.children.map((child) => ({
          ...child,
          label: `${entry.label} · ${child.label}`,
          icon: child.icon === 'folder' ? entry.icon : child.icon,
        })),
  )
}

/**
 * Бүх модулийн хайлттай жагсаалт. Drawer нь хурдан үсрэхэд, энэ таб нь
 * хайх, ямар модуль утсан дээр бэлэн болохыг харахад зориулагдсан.
 */
export function MenuScreen() {
  const tabBarInset = useTabBarInset()
  const openDrawer = useDrawerToggle()
  const [query, setQuery] = useState('')
  const menu = useAdminMenu(query)

  const sections = menu.groups.map((group) => ({
    title: group.title,
    data: flatten(group.entries),
  }))

  return (
    <Screen edges={['top']} padded={false}>
      <View className="gap-3 px-4">
        <AppHeader
          title={messages.tabs.menu}
          subtitle={`${menu.ready}/${menu.total} ${messages.nav.ready}`}
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

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: tabBarInset,
        }}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} className="pb-2 pt-4" />
        )}
        renderItem={({ item, index, section }) => (
          <MenuModuleRow
            entry={item}
            first={index === 0}
            last={index === section.data.length - 1}
          />
        )}
        ListEmptyComponent={
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
        }
      />
    </Screen>
  )
}
