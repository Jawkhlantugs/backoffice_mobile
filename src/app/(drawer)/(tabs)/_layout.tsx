import { Tabs } from 'expo-router'

import { AppTabBar, TAB_ITEMS } from '@/components'

/**
 * Доод таб: Нүүр · Цэс · Ажил · Профайл. Дүрс, шошго нь `TAB_ITEMS`-д —
 * таб bar ба энэ layout хоёр нэг эх сурвалжаас уншина.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppTabBar {...props} />}
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
