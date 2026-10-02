import type { ReactElement } from 'react'
import { useRouter } from 'expo-router'
import { View } from 'react-native'

import { AppHeader, EmptyState, Screen } from '@/components'
import { useScreenLeading } from '@/core/navigation/use-screen-leading'
import { useRouteAccess } from '@/hooks/use-admin-menu'
import { messages } from '@/lib/messages'

export type RouteGuardProps = {
  /** expo-router-ийн route нэр — `screenLayout`-ийн `route.name`. */
  routeName: string
  children: ReactElement
}

/**
 * Navigator-ийн `screenLayout`. Эрхгүй бол дэлгэцийн компонент огт
 * mount болохгүй — түүний query ч сервер рүү явахгүй.
 */
export function RouteGuard({ routeName, children }: RouteGuardProps) {
  const canOpen = useRouteAccess()

  return canOpen(routeName) ? children : <NoAccessScreen />
}

function NoAccessScreen() {
  const router = useRouter()
  const leading = useScreenLeading()

  return (
    <Screen>
      <AppHeader title={messages.nav.noAccess} leading={leading} />
      <View className="flex-1 justify-center">
        <EmptyState
          icon="lock"
          title={messages.nav.noAccess}
          description={messages.nav.routeNoAccessHint}
          action={{
            label: messages.nav.goHome,
            onPress: () => router.replace('/'),
          }}
        />
      </View>
    </Screen>
  )
}
