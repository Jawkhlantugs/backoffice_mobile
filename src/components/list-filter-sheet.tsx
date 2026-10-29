import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import type { ListFilters } from '@/lib/list-filters'
import { messages } from '@/lib/messages'

import { AppButton } from './app-button'
import { AppInput } from './app-input'
import { AppText } from './app-text'
import { BackofficeBottomSheet } from './backoffice-bottom-sheet'
import { ChoiceField } from './choice-field'
import { DateField } from './date-field'

export type ListFilterField = {
  key: string
  label: string
  placeholder?: string
  /** Asset (`USDT`) том үсгээр, ID жижиг үсгээр — вэбийн утгатай таарна. */
  autoCapitalize?: 'none' | 'characters'
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad'
  /** Вэбийн `type: 'number'` — тоо биш оролтыг авахгүй. */
  numeric?: boolean
  /**
   * Вэбийн дүн + `showWhen` нөхцөл: дүн бичвэл Тэнцүү/Их/Бага гарна.
   * Шалгалтыг (валютын орон) дуудагч өгнө — компонент мөнгө мэдэхгүй.
   */
  amount?: { conditionKey: string; isValid: (raw: string) => boolean }
}

/** Вэбийн `AMOUNT_CONDITIONS` (`EQUAL` анхдагч). */
const CONDITIONS = ['EQUAL', 'GREATER_THAN', 'LESS_THAN'] as const
type Condition = (typeof CONDITIONS)[number]

const text = messages.finance.filters

/**
 * Вэбийн filter panel-ийн утасны хувилбар: текст талбарууд + огнооны муж
 * (вэбийн `DateRangePicker` → эхлэх, дуусах өдөр).
 * Статус нь жагсаалтын чип дээр байдаг тул энд орохгүй.
 */
export function ListFilterSheet({
  visible,
  fields,
  value,
  withDateRange = true,
  onApply,
  onClose,
}: {
  visible: boolean
  fields: ListFilterField[]
  value: ListFilters
  withDateRange?: boolean
  onApply: (value: ListFilters) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState(value)
  const [wasVisible, setWasVisible] = useState(visible)

  // Нээх бүрд хэрэглэгдэж буй шүүлтүүрээс эхэлнэ — хаасан ноорог үлдэхгүй.
  if (visible !== wasVisible) {
    setWasVisible(visible)
    if (visible) setDraft(value)
  }

  const set = (patch: ListFilters) =>
    setDraft((current) => ({ ...current, ...patch }))

  const rangeInvalid =
    draft.start_day !== undefined &&
    draft.end_day !== undefined &&
    draft.start_day > draft.end_day

  const invalidAmounts = new Set(
    fields
      .filter((field) => {
        const raw = draft[field.key]
        return field.amount && raw !== undefined && !field.amount.isValid(raw)
      })
      .map((field) => field.key),
  )

  /** Дүн хоосон бол нөхцөл үлдэхгүй; бичсэн бол анхдагч нь Тэнцүү. */
  function normalized(): ListFilters {
    const next = { ...draft }
    for (const field of fields) {
      if (!field.amount) continue
      const key = field.amount.conditionKey
      next[key] = next[field.key] ? (next[key] ?? 'EQUAL') : undefined
    }
    return next
  }

  return (
    <BackofficeBottomSheet
      visible={visible}
      title={text.open}
      onClose={onClose}
    >
      <ScrollView
        className="shrink"
        contentContainerClassName="gap-4"
        keyboardShouldPersistTaps="handled"
      >
        {fields.map((field) => (
          <View key={field.key} className="gap-4">
            <AppInput
              label={field.label}
              placeholder={field.placeholder}
              value={draft[field.key] ?? ''}
              onChangeText={(raw) => {
                const value = field.numeric ? raw.replace(/\D/g, '') : raw
                set({ [field.key]: value.trim() || undefined })
              }}
              autoCapitalize={field.autoCapitalize ?? 'none'}
              autoCorrect={false}
              keyboardType={field.amount ? 'decimal-pad' : field.keyboardType}
              error={
                invalidAmounts.has(field.key) ? text.invalidNumber : undefined
              }
            />
            {field.amount && draft[field.key] ? (
              <ChoiceField<Condition>
                label={text.condition}
                options={CONDITIONS.map((condition) => ({
                  value: condition,
                  label: text.conditions[condition],
                }))}
                value={
                  (draft[field.amount.conditionKey] as Condition | undefined) ??
                  'EQUAL'
                }
                onChange={(condition) =>
                  field.amount &&
                  set({ [field.amount.conditionKey]: condition })
                }
              />
            ) : null}
          </View>
        ))}
        {withDateRange ? (
          <View className="gap-4">
            <DateField
              label={text.startDay}
              value={draft.start_day ?? null}
              onChange={(day) => set({ start_day: day ?? undefined })}
              quickPicks={['today', 'yesterday']}
              clearLabel={text.noDate}
            />
            <DateField
              label={text.endDay}
              value={draft.end_day ?? null}
              onChange={(day) => set({ end_day: day ?? undefined })}
              quickPicks={['today', 'yesterday']}
              clearLabel={text.noDate}
            />
            {rangeInvalid ? (
              <AppText variant="caption" className="text-destructive">
                {text.invalidRange}
              </AppText>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppButton
            label={text.reset}
            variant="secondary"
            onPress={() => {
              onApply({})
              onClose()
            }}
          />
        </View>
        <View className="flex-1">
          <AppButton
            label={text.apply}
            icon="filter"
            disabled={rangeInvalid || invalidAmounts.size > 0}
            onPress={() => {
              onApply(normalized())
              onClose()
            }}
          />
        </View>
      </View>
    </BackofficeBottomSheet>
  )
}
