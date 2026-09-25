import { Pressable } from 'react-native'

import { cn } from '@/lib/cn'

import { AppText } from './app-text'

/**
 * Жижиг текст холбоос — "Бүгд", "Дахин холбогдох" гэх мэт мөр доторх
 * үйлдэл. Дэвсгэргүй тул glass биш; хүрэлтийн бай 44pt.
 */
export function TextButton({
  label,
  onPress,
  className,
}: {
  label: string
  onPress: () => void
  className?: string
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      className={cn(
        'min-h-11 justify-center px-2 active:opacity-60',
        className,
      )}
    >
      <AppText variant="caption" className="font-semibold text-foreground">
        {label}
      </AppText>
    </Pressable>
  )
}
