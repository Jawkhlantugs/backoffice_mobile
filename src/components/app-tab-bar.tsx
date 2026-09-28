import { Pressable } from 'react-native'
import type { BottomTabBarProps } from 'expo-router/tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { spacing, tabBar } from '@/theme/tokens'

import { AppIcon, type AppIconName } from './app-icon'
import { AppText } from './app-text'
import { GlassSurface } from './glass-surface'

/**
 * Доод табын жагсаалт. Route-ийн нэр, дүрс, шошго нэг дор байснаар
 * `(tabs)/_layout.tsx` ба таб bar хоёр зөрөхгүй. Шошго нь getter — хэл
 * солиход идэвхтэй хэлээр уншигдана.
 */
export const TAB_ITEMS = [
  {
    name: 'index',
    icon: 'home',
    get title() {
      return messages.tabs.home
    },
  },
  {
    name: 'menu',
    icon: 'modules',
    get title() {
      return messages.tabs.menu
    },
  },
  {
    name: 'leave',
    icon: 'work',
    get title() {
      return messages.tabs.work
    },
  },
  {
    name: 'profile',
    icon: 'profile',
    get title() {
      return messages.tabs.profile
    },
  },
] as const satisfies readonly {
  name: string
  icon: AppIconName
  title: string
}[]

function barBottom(safeBottom: number) {
  return Math.max(safeBottom, spacing.md)
}

/**
 * Хөвөгч таб bar-ийн ард контент нуугдахгүйн тулд таб доторх дэлгэцийн
 * scroll-ын доод зай. Таб дээрх хөвөгч товч ч энэ өндрөөс дээш байрлана.
 */
export function useTabBarInset(): number {
  const insets = useSafeAreaInsets()
  return tabBar.height + barBottom(insets.bottom) + spacing.md
}

/**
 * iOS 26 шиг хөвөгч glass капсул — контент ард нь гүйнэ. Идэвхтэй табыг
 * зөвхөн өнгө + тод шошгоор ялгана (зураасгүй); дүрсний ард дугуй/капсул
 * тодруулга **байхгүй** (хэрэглэгчийн шийдвэр).
 */
export function AppTabBar({ state, navigation, insets }: BottomTabBarProps) {
  return (
    <GlassSurface
      interactive
      className="absolute inset-x-4 flex-row rounded-full px-2"
      fallbackClassName="border border-border bg-elevated"
      style={{ bottom: barBottom(insets.bottom), height: tabBar.height }}
    >
      {state.routes.map((route, index) => {
        const item = TAB_ITEMS.find((tab) => tab.name === route.name)
        if (!item) return null

        const focused = state.index === index

        function handlePress() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={item.title}
            onPress={handlePress}
            className="flex-1 items-center justify-center gap-1"
          >
            <AppIcon
              name={item.icon}
              size={tabBar.iconSize}
              tone={focused ? 'default' : 'muted'}
            />

            <AppText
              variant="tiny"
              className={cn(
                focused
                  ? 'font-semibold text-primary'
                  : 'text-muted-foreground',
              )}
            >
              {item.title}
            </AppText>
          </Pressable>
        )
      })}
    </GlassSurface>
  )
}
