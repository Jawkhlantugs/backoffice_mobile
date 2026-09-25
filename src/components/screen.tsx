import { View, type ViewProps } from 'react-native'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'

import { cn } from '@/lib/cn'

/**
 * Дэлгэцийн гадна хүрээ: safe area + design-tokens.md §2-ийн 16pt хажуугийн
 * зай. Таб доторх дэлгэц доод захыг таб bar-т үлдээнэ (`edges`).
 */
export function Screen({
  className,
  padded = true,
  edges = ['top', 'bottom'],
  ...rest
}: ViewProps & { padded?: boolean; edges?: readonly Edge[] }) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={edges}>
      <View className={cn('flex-1', padded && 'px-4', className)} {...rest} />
    </SafeAreaView>
  )
}
