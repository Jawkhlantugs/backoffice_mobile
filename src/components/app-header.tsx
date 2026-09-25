import { View } from 'react-native'

import { cn } from '@/lib/cn'

import type { AppIconName } from './app-icon'
import { AppText } from './app-text'
import { IconButton } from './icon-button'

export type HeaderAction = {
  icon: AppIconName
  label: string
  onPress: () => void
}

/**
 * Дэлгэц бүрийн толгой. Зүүн талд цэс эсвэл буцах товч, төвд гарчиг,
 * баруун талд хамгийн ихдээ хоёр үйлдэл. Товчнууд нь glass `IconButton`.
 */
export function AppHeader({
  title,
  subtitle,
  leading,
  actions = [],
  right,
  className,
}: {
  title: string
  subtitle?: string
  leading?: HeaderAction
  actions?: HeaderAction[]
  /** Үйлдлийн товчны оронд харуулах элемент (аватар гэх мэт). */
  right?: React.ReactNode
  className?: string
}) {
  return (
    <View className={cn('h-14 flex-row items-center gap-2', className)}>
      {leading ? <IconButton {...leading} /> : null}

      <View className="flex-1 justify-center">
        <AppText variant="title" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {actions.map((action) => (
        <IconButton key={action.icon} {...action} />
      ))}
      {right}
    </View>
  )
}
