import { View } from 'react-native'

import { cn } from '@/lib/cn'

import { AppButton } from './app-button'
import { AppText } from './app-text'
import { IconChip } from './icon-chip'
import type { AppIconName } from './app-icon'

/** Хоосон, алдаатай төлөвийн нэг хэлбэр — дүрс, гарчиг, тайлбар, үйлдэл. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: AppIconName
  title: string
  description?: string
  action?: { label: string; onPress: () => void | Promise<void> }
  className?: string
}) {
  return (
    <View className={cn('items-center gap-3 px-6 py-10', className)}>
      <IconChip name={icon} size="lg" />

      <View className="gap-1">
        <AppText variant="body" className="text-center font-medium">
          {title}
        </AppText>
        {description ? (
          <AppText variant="caption" className="text-center">
            {description}
          </AppText>
        ) : null}
      </View>

      {action ? (
        <AppButton
          label={action.label}
          variant="secondary"
          onPress={action.onPress}
          className="mt-1 min-w-40"
        />
      ) : null}
    </View>
  )
}
