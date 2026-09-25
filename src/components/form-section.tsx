import { View } from 'react-native'

import { cn } from '@/lib/cn'

import { AppText } from './app-text'

/**
 * Формын бүлэг — "Монгол", "English", "Тохиргоо" гэх мэт. Урт формыг
 * утсан дээр хэсэгчлэн уншуулна.
 */
export function FormSection({
  title,
  hint,
  className,
  children,
}: {
  title: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <View className={cn('gap-3', className)}>
      <View className="gap-0.5">
        <AppText variant="tiny" className="uppercase tracking-wider">
          {title}
        </AppText>
        {hint ? <AppText variant="caption">{hint}</AppText> : null}
      </View>
      <View className="gap-4 rounded-xl border border-border bg-card p-4">
        {children}
      </View>
    </View>
  )
}
