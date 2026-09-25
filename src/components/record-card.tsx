import { useState } from 'react'
import { View } from 'react-native'
import { Image } from 'expo-image'

import type { AmountField } from '@/core/money/format'
import { radius } from '@/theme/tokens'

import { AmountText } from './amount-text'
import { AppCard } from './app-card'
import { AppText } from './app-text'
import type { RecordAction } from './record-actions'
import { RecordDetailSheet } from './record-detail-sheet'
import { visibleFields, type RecordField } from './record-field'
import { RecordFieldValue } from './record-field-value'
import { StatusPill, type StatusTone } from './status-pill'

/** Banner-ын 16:9 харьцаа. */
const IMAGE_RATIO = 16 / 9

/** Картан дээрх торын дээд хэмжээ — үлдсэн нь дэлгэрэнгүйд. */
const GRID_LIMIT = 4

/**
 * Хүснэгтийн мөрийн mobile хэлбэр: гарчиг + статус, том дүн, 2 баганат
 * гол талбарууд. Дарахад бүх талбар (`details`) ба үйлдлүүд хавтанд гарна —
 * жагсаалт богино, дэлгэрэнгүй нэг хүрэлтэд.
 */
export function RecordCard({
  title,
  subtitle,
  status,
  amount,
  fields = [],
  details = [],
  actions,
  image,
  onPress,
}: {
  title: string
  subtitle?: string
  status?: { label: string; tone: StatusTone }
  amount?: AmountField
  /** Картан дээр харагдах гол талбарууд (4 хүртэл). */
  fields?: RecordField[]
  /** Зөвхөн дэлгэрэнгүйд — txnId, огноо гэх мэт. */
  details?: RecordField[]
  actions?: RecordAction[]
  /** Картын дээд хэсэгт харагдах зураг (banner гэх мэт). */
  image?: string
  /** Өгвөл дэлгэрэнгүй хавтангийн оронд үүнийг дуудна — засах дэлгэц рүү. */
  onPress?: () => void
}) {
  const [open, setOpen] = useState(false)
  const grid = visibleFields(fields).slice(0, GRID_LIMIT)

  return (
    <>
      <AppCard
        onPress={onPress ?? (() => setOpen(true))}
        accessibilityLabel={title}
        className="gap-3"
      >
        {image ? (
          <Image
            source={{ uri: image }}
            contentFit="cover"
            // expo-image нь className уншдаггүй — токеноос style.
            style={{
              width: '100%',
              aspectRatio: IMAGE_RATIO,
              borderRadius: radius.lg,
            }}
          />
        ) : null}
        <View className="flex-row items-start gap-3">
          <View className="flex-1 gap-0.5">
            <AppText variant="body" numberOfLines={1} className="font-semibold">
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="caption" numberOfLines={1}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
          {status ? (
            <StatusPill label={status.label} tone={status.tone} />
          ) : null}
        </View>

        {amount ? <AmountText amount={amount} variant="title" /> : null}

        {grid.length > 0 ? (
          <View className="flex-row flex-wrap gap-y-2">
            {grid.map((field) => (
              <View key={field.label} className="w-1/2 gap-0.5 pr-2">
                <AppText variant="tiny" numberOfLines={1}>
                  {field.label}
                </AppText>
                <RecordFieldValue
                  field={field}
                  variant="caption"
                  numberOfLines={1}
                  className="text-foreground"
                />
              </View>
            ))}
          </View>
        ) : null}
      </AppCard>

      <RecordDetailSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={title}
        status={status}
        amount={amount}
        fields={[...fields, ...details]}
        actions={actions}
      />
    </>
  )
}
