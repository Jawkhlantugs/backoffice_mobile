import { View } from 'react-native'

import { AppCard, InfoRow, SectionHeader } from '@/components'
import { cn } from '@/lib/cn'

/** Гарчигтай, шошго/утгын мөрүүдтэй карт — хоосон утгатай мөрийг алгасна. */
export function InfoSection({
  title,
  rows,
}: {
  title: string
  rows: readonly { label: string; value: string | undefined }[]
}) {
  const visible = rows.filter((row) => row.value)
  if (visible.length === 0) return null

  return (
    <View className="gap-2">
      <SectionHeader title={title} />
      <AppCard className="gap-0 py-1">
        {visible.map((row, index) => (
          <InfoRow
            key={row.label}
            label={row.label}
            value={row.value ?? ''}
            className={cn('py-2.5', index > 0 && 'border-t border-border')}
          />
        ))}
      </AppCard>
    </View>
  )
}
