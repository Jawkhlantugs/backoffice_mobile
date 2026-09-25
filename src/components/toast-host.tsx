import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useToastStore, type ToastTone } from '@/core/ui/toast-store'
import { cn } from '@/lib/cn'
import { iconSize, spacing } from '@/theme/tokens'

import { AppIcon, type AppIconName } from './app-icon'
import { AppText } from './app-text'
import { GlassSurface } from './glass-surface'

const VISIBLE_MS = 4000

const TONE: Record<ToastTone, string> = {
  error: 'bg-destructive-subtle border-destructive',
  success: 'bg-success-subtle border-success',
  info: 'bg-muted border-border',
}

const TONE_TEXT: Record<ToastTone, string> = {
  error: 'text-destructive',
  success: 'text-success',
  info: 'text-foreground',
}

const TONE_ICON: Record<ToastTone, AppIconName> = {
  error: 'warning',
  success: 'checkCircle',
  info: 'info',
}

/**
 * Бүх дэлгэцийн дээр нэг л удаа render хийгдэнэ (`_layout`). Дарвал шууд
 * хаагдана — админ дараагийн үйлдлээ хийхэд саад болохгүй.
 */
export function ToastHost() {
  const current = useToastStore((store) => store.current)
  const dismiss = useToastStore((store) => store.dismiss)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!current) return
    const timer = setTimeout(dismiss, VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [current, dismiss])

  if (!current) return null

  return (
    <View
      className="absolute inset-x-4 z-50"
      // `pointerEvents` нь RN 0.76-аас хойш prop биш style — prop хэлбэрээр
      // өгвөл LogBox-д deprecation warning гарна.
      style={{ top: insets.top + spacing.sm, pointerEvents: 'box-none' }}
    >
      <Pressable accessibilityRole="alert" onPress={dismiss}>
        <GlassSurface
          fallbackClassName={cn('border', TONE[current.tone])}
          className="flex-row items-center gap-2 rounded-2xl p-3"
        >
          <AppIcon name={TONE_ICON[current.tone]} size={iconSize.sm} />
          <AppText
            variant="body"
            className={cn('flex-1', TONE_TEXT[current.tone])}
          >
            {current.message}
          </AppText>
        </GlassSurface>
      </Pressable>
    </View>
  )
}
