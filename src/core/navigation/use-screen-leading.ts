import { useRouter } from 'expo-router'

import type { HeaderAction } from '@/components/app-header'
import { messages } from '@/lib/messages'

import { useDrawerToggle } from './use-drawer-toggle'

/**
 * Толгойн зүүн товч: drawer доорх дэлгэцэд цэс, Stack дээр нээгдсэнд
 * буцах. Зөвхөн **төрөл**-ийг components-оос (menu-icons.ts шиг).
 */
export function useScreenLeading(): HeaderAction {
  const router = useRouter()
  const openDrawer = useDrawerToggle()

  return openDrawer
    ? { icon: 'menu', label: messages.nav.openMenu, onPress: openDrawer }
    : { icon: 'back', label: messages.nav.back, onPress: () => router.back() }
}
