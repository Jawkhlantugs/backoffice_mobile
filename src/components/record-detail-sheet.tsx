import { ScrollView, View } from 'react-native'

import { AmountText } from './amount-text'
import { AppText } from './app-text'
import { BottomSheet } from './bottom-sheet'
import { RecordActions, type RecordAction } from './record-actions'
import { visibleFields, type RecordField } from './record-field'
import { RecordFieldValue } from './record-field-value'
import { StatusPill, type StatusTone } from './status-pill'
import type { AmountField } from '@/core/money/format'

/**
 * Бичлэгийн бүх талбар доороос гарах хавтанд — вэбийн 20 баганат мөрийн
 * mobile хувилбар. Утгыг удаан дарж хуулна (txnId, хаяг).
 */
export function RecordDetailSheet({
  visible,
  onClose,
  title,
  status,
  amount,
  fields,
  actions,
}: {
  visible: boolean
  onClose: () => void
  title: string
  status?: { label: string; tone: StatusTone }
  amount?: AmountField
  fields: readonly RecordField[]
  actions?: RecordAction[]
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="flex-row items-start gap-3">
        <AppText variant="title" selectable className="flex-1">
          {title}
        </AppText>
        {status ? <StatusPill label={status.label} tone={status.tone} /> : null}
      </View>

      {amount ? <AmountText amount={amount} variant="display" /> : null}

      <ScrollView className="shrink" contentContainerClassName="gap-3">
        {visibleFields(fields).map((field) => (
          <View
            key={field.label}
            className="gap-0.5 border-b border-border pb-3"
          >
            <AppText variant="tiny">{field.label}</AppText>
            <RecordFieldValue field={field} variant="body" />
          </View>
        ))}
      </ScrollView>

      {actions?.length ? <RecordActions actions={actions} /> : null}
    </BottomSheet>
  )
}
