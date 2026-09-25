import { View } from 'react-native'

import { cn } from '@/lib/cn'
import { iconSize } from '@/theme/tokens'

import { AppIcon, type AppIconName } from './app-icon'
import { AppSwitch } from './app-switch'
import { AppText } from './app-text'

/** Дүрс, тайлбартай унтраалга — тохиргооны мөр. */
export function ToggleRow({
  icon,
  title,
  hint,
  value,
  onChange,
  disabled = false,
  className,
}: {
  icon: AppIconName
  title: string
  hint?: string
  value: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-3',
        disabled && 'opacity-50',
        className,
      )}
    >
      <AppIcon name={icon} size={iconSize.md} tone="default" />

      <View className="flex-1 gap-0.5">
        <AppText variant="body" className="font-medium">
          {title}
        </AppText>
        {hint ? <AppText variant="caption">{hint}</AppText> : null}
      </View>

      <AppSwitch
        value={value}
        onChange={onChange}
        disabled={disabled}
        label={title}
      />
    </View>
  )
}
