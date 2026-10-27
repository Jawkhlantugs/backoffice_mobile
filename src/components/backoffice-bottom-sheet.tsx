import { useEffect, useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { duration } from '@/theme/tokens'
import { useAppColors } from '@/theme/use-theme'

import { AppText } from './app-text'
import { GlassSurface } from './glass-surface'

const TIMING = { duration: duration.slow, easing: Easing.out(Easing.cubic) }

/** Хавтангийн өндрийн энэ хэсгээс доош чирвэл хаагдана. */
const CLOSE_RATIO = 0.25
/** Богино ч хурдан шидвэл хаагдана (pt/s). */
const CLOSE_VELOCITY = 800

// NativeWind-ийн className Reanimated компонентод найдваргүй (skeleton.tsx).
const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: { maxHeight: '80%' },
})

/**
 * Доороос гарах glass хавтан — ConfirmSheet, SelectSheet, шүүлтүүр бүгд
 * үүн дээр. Modal-ийн `slide` нь харлах давхаргыг хавтантай хамт гулсуулдаг
 * тул ард нь бүдгэрч, зөвхөн хавтан гулсана. Ард дарах эсвэл доош чирэхэд хаагдана.
 */
export function BackofficeBottomSheet({
  visible,
  title,
  onClose,
  className,
  children,
}: {
  visible: boolean
  title?: string
  onClose: () => void
  className?: string
  children: React.ReactNode
}) {
  const { colors } = useAppColors()
  const { height: windowHeight } = useWindowDimensions()
  const [mounted, setMounted] = useState(visible)
  if (visible && !mounted) setMounted(true)

  const progress = useSharedValue(0)
  const drag = useSharedValue(0)
  // Хэмжихээс өмнө дэлгэцийн өндрөөр — эхний кадрт хавтан харагдахгүй.
  const sheetHeight = useSharedValue(windowHeight)

  useEffect(() => {
    progress.set(withTiming(visible ? 1 : 0, TIMING))
    if (visible) {
      drag.set(0)
      return
    }
    // Гарах хөдөлгөөн дуусахыг хүлээгээд Modal-ийг буулгана.
    const timer = setTimeout(() => setMounted(false), TIMING.duration)
    return () => clearTimeout(timer)
  }, [visible, progress, drag])

  // Бариул + гарчгаас л чирнэ — доторх ScrollView-ийн гүйлгэлттэй мөргөлдөхгүй.
  const pan = Gesture.Pan()
    .activeOffsetY(8)
    .onUpdate((event) => {
      drag.set(Math.max(event.translationY, 0))
    })
    .onEnd((event) => {
      const far = event.translationY > sheetHeight.get() * CLOSE_RATIO
      if (far || event.velocityY > CLOSE_VELOCITY) {
        scheduleOnRN(onClose)
      } else {
        drag.set(withTiming(0, TIMING))
      }
    })

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.get() * (1 - drag.get() / sheetHeight.get()),
  }))
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - progress.get()) * sheetHeight.get() + drag.get() },
    ],
  }))

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Modal нь тусдаа native root — gesture-д өөрийн root хэрэгтэй. */}
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.overlay },
            backdropStyle,
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={messages.common.close}
          />
        </Animated.View>
        <Animated.View
          style={[styles.sheet, sheetStyle]}
          onLayout={(event) => sheetHeight.set(event.nativeEvent.layout.height)}
        >
          <GlassSurface
            fallbackClassName="border-t border-border bg-elevated"
            className={cn('shrink gap-4 rounded-t-3xl p-5 pb-8', className)}
          >
            <GestureDetector gesture={pan}>
              {/* Сөрөг зайгаар хавтангийн дээд ирмэг хүртэл барих талбайг томсгоно. */}
              <View className="-mx-5 -mt-5 gap-4 px-5 pt-5">
                <View className="h-1 w-10 self-center rounded-full bg-border" />
                {title ? <AppText variant="title">{title}</AppText> : null}
              </View>
            </GestureDetector>
            {children}
          </GlassSurface>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  )
}
