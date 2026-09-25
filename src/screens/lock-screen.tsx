import { useEffect, useState } from 'react'
import { View } from 'react-native'

import { AppButton, AppText, IconChip, Screen } from '@/components'
import { tryUnlock } from '@/core/session/use-app-lock'
import { useSessionStore } from '@/core/session/session-store'
import { messages } from '@/lib/messages'

/**
 * Түгжигдсэн дэлгэц.
 *
 * `src/app/`-аас гадуур байгаа нь санамсаргүй биш: энэ бол route биш,
 * `_layout` session статусаар шууд сонгодог. `app/` дотор байвал expo-router
 * үүнийг /lock хаяг болгож, түгжээг тойрох зам нээгдэнэ.
 */
export function LockScreen() {
  const [failed, setFailed] = useState(false)
  const signOut = useSessionStore((store) => store.signOut)

  // Дэлгэц гарангуут биометрикийг нэг удаа өөрөө асууна — админ нэмэлт товч
  // дарах шаардлагагүй. Амжилтгүй бол доорх товчоор дахин оролдоно.
  useEffect(() => {
    let cancelled = false
    void tryUnlock().then((passed) => {
      if (!cancelled) setFailed(!passed)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Screen className="items-center justify-center gap-6">
      <IconChip name="biometric" size="lg" />

      <View className="items-center gap-2">
        <AppText variant="heading">{messages.auth.locked}</AppText>
        <AppText variant="body" className="text-center text-muted-foreground">
          {messages.auth.unlockReason}
        </AppText>
      </View>

      {failed ? (
        <View className="items-center gap-2">
          <AppButton
            label={messages.auth.unlock}
            icon="biometric"
            className="min-w-56"
            onPress={async () => setFailed(!(await tryUnlock()))}
          />
          {/* Гарах зам үргэлж нээлттэй: биометрик эвдэрсэн админ аппдаа
              түгжигдэн үлдэх учиргүй. */}
          <AppButton
            label={messages.auth.signOut}
            variant="ghost"
            icon="signOut"
            onPress={() => signOut()}
          />
        </View>
      ) : null}
    </Screen>
  )
}
