import { View } from 'react-native'

import { cn } from '@/lib/cn'
import { messages, translateUnknownError } from '@/lib/messages'

import { AppLoader } from './app-loader'
import { EmptyState } from './empty-state'
import type { AppIconName } from './app-icon'

/**
 * Loading / empty / error гурван төлөв (§17). Жагсаалт бүр эдгээрийг гараар
 * давтахын оронд үүнийг ашиглана — ингэснээр retry товч хаана ч мартагдахгүй.
 */
export function StateView({
  loading,
  error,
  isEmpty,
  onRetry,
  emptyIcon = 'inbox',
  emptyLabel = messages.common.empty,
  emptyHint,
  children,
  className,
}: {
  loading?: boolean
  /** Query/mutation-ийн алдаа — төрөл нь `unknown`, дотор нь шалгана. */
  error?: unknown
  isEmpty?: boolean
  onRetry?: () => void
  emptyIcon?: AppIconName
  emptyLabel?: string
  emptyHint?: string
  children: React.ReactNode
  className?: string
}) {
  if (loading) return <AppLoader className={className} />

  if (error) {
    return (
      <View className={cn('flex-1 justify-center', className)}>
        <EmptyState
          icon="warning"
          title={messages.common.errorTitle}
          description={translateUnknownError(error)}
          action={
            onRetry
              ? { label: messages.common.retry, onPress: onRetry }
              : undefined
          }
        />
      </View>
    )
  }

  if (isEmpty) {
    return (
      <View className={cn('flex-1 justify-center', className)}>
        <EmptyState
          icon={emptyIcon}
          title={emptyLabel}
          description={emptyHint}
        />
      </View>
    )
  }

  return <>{children}</>
}
