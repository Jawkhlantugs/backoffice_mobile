import { useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, View } from 'react-native'

import { cn } from '@/lib/cn'
import { duration } from '@/theme/tokens'
import { useAppColors } from '@/theme/use-theme'

const MIN_OPACITY = 0.35
const MAX_OPACITY = 1
const STEP_MS = duration.slow * 2

/**
 * Ачаалж буй хайрцаг. Хэмжээ нь гаднах View-ийн class-аас, анивчих нь
 * дотоод Animated давхаргаас — NativeWind-ийн class Animated компонентод
 * найдваргүй тул өнгийг токеноос шууд өгнө.
 */
export function Skeleton({ className }: { className?: string }) {
  const [pulse] = useState(() => new Animated.Value(MAX_OPACITY))
  const { colors } = useAppColors()

  useEffect(() => {
    const step = (toValue: number) =>
      Animated.timing(pulse, {
        toValue,
        duration: STEP_MS,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })

    const animation = Animated.loop(
      Animated.sequence([step(MIN_OPACITY), step(MAX_OPACITY)]),
    )

    animation.start()
    return () => animation.stop()
  }, [pulse])

  return (
    <View className={cn('overflow-hidden rounded-md', className)}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.muted, opacity: pulse },
        ]}
      />
    </View>
  )
}
