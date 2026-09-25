import { View } from 'react-native'

import { cn } from '@/lib/cn'

import { AppText } from './app-text'

/** Зүүн талд шошго, баруун талд утга — дэлгэрэнгүй, профайлын карт. */
export function InfoRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <View
      className={cn('flex-row items-start justify-between gap-3', className)}
    >
      <AppText variant="label">{label}</AppText>
      <AppText variant="body" className="flex-1 text-right">
        {value}
      </AppText>
    </View>
  )
}
