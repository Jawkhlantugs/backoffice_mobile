import { Tabs } from 'expo-router'

import { AppTabBar, TAB_ITEMS } from '@/components'
import { useRouteAccess } from '@/hooks/use-admin-menu'
import { RouteGuard } from '@/screens/shell/route-guard'

/**
 * Доод таб: Нүүр · Цэс · Ажил · Профайл. Дүрс, шошго нь `TAB_ITEMS`-д —
 * таб bar ба энэ layout хоёр нэг эх сурвалжаас уншина.
 */
export default function TabsLayout() {
  const canOpen = useRouteAccess()
  const hidden = TAB_ITEMS.filter((item) => !canOpen(item.name)).map(
    (item) => item.name,
  )

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      screenLayout={({ route, children }) => (
        <RouteGuard routeName={route.name}>{children}</RouteGuard>
      )}
      tabBar={(props) => <AppTabBar {...props} hidden={hidden} />}
    >
      {TAB_ITEMS.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{ title: item.title }}
        />
      ))}
    </Tabs>
  )
}
