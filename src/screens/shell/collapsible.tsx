import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { duration } from '@/theme/tokens'

const TIMING = { duration: duration.normal, easing: Easing.out(Easing.cubic) }

// NativeWind-ийн className Reanimated компонентод найдваргүй (skeleton.tsx).
const styles = StyleSheet.create({ clip: { overflow: 'hidden' } })

/**
 * Өндрөө 0 ↔ агуулгын өндөр хооронд хөдөлгөнө — доорх мөрүүд үсрэхгүй,
 * дагаж гулсана. Drawer-т 90 орчим мөр байгаа тул анх нээгдэх хүртэл
 * агуулгыг mount хийхгүй.
 */
export function Collapsible({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)

  const height = useSharedValue(0)
  const progress = useSharedValue(open ? 1 : 0)

  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, TIMING))
  }, [open, progress])

  const style = useAnimatedStyle(() => ({
    height: height.get() * progress.get(),
    opacity: progress.get(),
  }))

  if (!mounted) return null

  return (
    <Animated.View
      style={[styles.clip, style]}
      accessibilityElementsHidden={!open}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
    >
      {/* Absolute тул эцгийн хөдөлж буй өндрөөр шахагдахгүй, бодит өндрөө хэмжинэ. */}
      <View
        className="absolute inset-x-0 top-0"
        onLayout={(event) => height.set(event.nativeEvent.layout.height)}
      >
        {children}
      </View>
    </Animated.View>
  )
}
