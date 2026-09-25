import { forwardRef } from 'react'
import { TextInput, View, type TextInputProps } from 'react-native'

import { cn } from '@/lib/cn'
import { useAppColors } from '@/theme/use-theme'

import { AppText } from './app-text'

export type AppInputProps = TextInputProps & {
  label?: string
  /** Талбарын доор улаанаар гарах алдаа. */
  error?: string
  className?: string
}

/**
 * Формын оролтын нэг л хэлбэр. Өндөр 44 нь design-tokens.md §2-оос —
 * хүрэлтийн бай 44-ээс багагүй байх ёстой.
 */
export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput(
  { label, error, className, multiline, ...rest },
  ref,
) {
  const { colors } = useAppColors()

  return (
    <View className="gap-1.5">
      {label ? <AppText variant="label">{label}</AppText> : null}
      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor={colors.mutedForeground}
        className={cn(
          'rounded-lg border bg-card px-3 text-body text-foreground',
          multiline ? 'min-h-24 py-3' : 'h-11 py-0',
          error ? 'border-destructive' : 'border-input',
          className,
        )}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" className="text-destructive">
          {error}
        </AppText>
      ) : null}
    </View>
  )
})
