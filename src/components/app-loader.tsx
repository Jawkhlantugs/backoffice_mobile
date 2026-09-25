import { ActivityIndicator, View } from 'react-native'

import { cn } from '@/lib/cn'
import { useAppColors } from '@/theme/use-theme'

export function AppLoader({
  className,
  size = 'large',
}: {
  className?: string
  size?: 'small' | 'large'
}) {
  const { colors } = useAppColors()
  return (
    <View className={cn('items-center justify-center p-6', className)}>
      <ActivityIndicator size={size} color={colors.mutedForeground} />
    </View>
  )
}
