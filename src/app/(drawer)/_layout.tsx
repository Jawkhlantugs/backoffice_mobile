import { useWindowDimensions } from 'react-native'
import { Drawer } from 'expo-router/drawer'

import { DrawerContent } from '@/screens/shell/drawer-content'
import { useAppColors } from '@/theme/use-theme'

/** Sidebar-ын өргөн — вэбийн 16rem-тэй ойролцоо, нарийн дэлгэц дээр багасна. */
const MAX_DRAWER_WIDTH = 320
const DRAWER_WIDTH_RATIO = 0.86
const SWIPE_EDGE_WIDTH = 40

/**
 * Вэбийн sidebar = mobile-ийн drawer. Доторх таб бүр энэ drawer-ийн дор
 * байрлана — аль ч табаас цэсээ шударч нээнэ.
 */
export default function DrawerLayout() {
  const { colors } = useAppColors()
  const { width } = useWindowDimensions()

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: colors.overlay,
        swipeEdgeWidth: SWIPE_EDGE_WIDTH,
        drawerStyle: {
          backgroundColor: colors.elevated,
          width: Math.min(MAX_DRAWER_WIDTH, width * DRAWER_WIDTH_RATIO),
        },
      }}
    />
  )
}
