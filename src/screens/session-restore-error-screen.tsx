import { View } from 'react-native'

import { AppButton, AppText, IconChip, Screen } from '@/components'
import { useSessionStore } from '@/core/session/session-store'
import { messages, translateUnknownError } from '@/lib/messages'

/**
 * Session сэргээх үед сүлжээ/сервер унасан. Token хүчинтэй хэвээр тул
 * гаргахгүй — дахин оролдох эсвэл өөрөө гарах сонголт өгнө.
 * `LockScreen`-ий адил route биш, `_layout` шууд сонгоно.
 */
export function SessionRestoreErrorScreen({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => Promise<void>
}) {
  const signOut = useSessionStore((store) => store.signOut)

  return (
    <Screen className="items-center justify-center gap-6">
      <IconChip name="offline" size="lg" />

      <View className="items-center gap-2">
        <AppText variant="heading">{messages.common.errorTitle}</AppText>
        <AppText variant="body" className="text-center text-muted-foreground">
          {translateUnknownError(error)}
        </AppText>
      </View>

      <View className="items-center gap-2">
        <AppButton
          label={messages.common.retry}
          className="min-w-56"
          onPress={onRetry}
        />
        <AppButton
          label={messages.auth.signOut}
          variant="ghost"
          icon="signOut"
          onPress={() => signOut()}
        />
      </View>
    </Screen>
  )
}
