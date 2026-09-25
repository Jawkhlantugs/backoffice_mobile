import { useNavigation } from 'expo-router'
import type { DrawerNavigationProp } from 'expo-router/drawer'

type DrawerNav = DrawerNavigationProp<Record<string, object | undefined>>

/**
 * Дэлгэцийн толгойн "цэс" товч. Drawer доор биш дэлгэцээс дуудвал `null`
 * буцаана — тэнд ажиллахгүй товч харуулахын оронд огт харуулахгүй.
 */
export function useDrawerToggle(): (() => void) | null {
  const navigation = useNavigation()
  const parent = navigation.getParent<DrawerNav | undefined>()

  if (!parent || typeof parent.openDrawer !== 'function') return null

  return () => parent.openDrawer()
}
