import { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { AppIcon } from '@/components'
import { duration, iconSize } from '@/theme/tokens'

const TIMING = { duration: duration.normal, easing: Easing.out(Easing.cubic) }
const HALF_TURN_DEG = 180

/** `Collapsible`-ийн хажуугийн сум — дүрс солихын оронд эргэнэ. */
export function ExpandChevron({ open }: { open: boolean }) {
  const turn = useSharedValue(open ? 1 : 0)

  useEffect(() => {
    turn.set(withTiming(open ? 1 : 0, TIMING))
  }, [open, turn])

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${turn.get() * HALF_TURN_DEG}deg` }],
  }))

  return (
    <Animated.View style={style}>
      <AppIcon name="expand" size={iconSize.sm} tone="muted" />
    </Animated.View>
  )
}
