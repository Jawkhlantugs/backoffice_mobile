import { Animated, StyleSheet, View } from 'react-native'

import { cn } from '@/lib/cn'

/**
 * Хэвтээ гүйлгэхэд зүүн талд наалдсан нүд. Мөр бүхэлдээ гүйх тул нүдийг
 * гүйлгэсэн зайгаар нь буцааж шилжүүлнэ (native driver) — хоёр жагсаалт
 * синк хийхээс илүү жигд. Animated давхаргад class тавихгүй (Skeleton шиг).
 */
export function DataTableStickyCell({
  offset,
  width,
  className,
  children,
}: {
  /** Хэвтээ гүйлгэлтийн зай, 0-ээс доош хавчсан. */
  offset: Animated.AnimatedInterpolation<number>
  width: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <Animated.View
      style={[styles.sticky, { width, transform: [{ translateX: offset }] }]}
    >
      <View
        className={cn(
          'flex-1 justify-center border-r border-border px-3',
          className,
        )}
      >
        {children}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  sticky: { position: 'absolute', left: 0, top: 0, bottom: 0 },
})
