import { Switch } from 'react-native'

import { useAppColors } from '@/theme/use-theme'

/**
 * Унтраалга. iOS 26 дээр системийн `UISwitch` өөрөө Liquid Glass эрхтэй тул
 * native-ийг л ашиглаж, өнгийг токеноос өгнө. Шууд `Switch` бүү бич.
 */
export function AppSwitch({
  value,
  onChange,
  disabled = false,
  label,
}: {
  value: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  label?: string
}) {
  const { colors } = useAppColors()

  return (
    <Switch
      accessibilityLabel={label}
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      trackColor={{ false: colors.muted, true: colors.success }}
      thumbColor={colors.elevated}
      ios_backgroundColor={colors.muted}
    />
  )
}
