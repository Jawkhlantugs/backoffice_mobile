import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import dayjs from 'dayjs'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { AppButton } from './app-button'
import { AppIcon } from './app-icon'
import { AppText } from './app-text'
import { BottomSheet } from './bottom-sheet'
import { FilterChips } from './filter-chips'
import { NativeDatePicker } from './native-date-picker'

/** Утга нь API-тай ижил `YYYY-MM-DD` — цагийн бүс хөрвүүлэхгүй. */
const FORMAT = 'YYYY-MM-DD'

type Quick = 'today' | 'tomorrow' | 'nextWeek' | 'none'

function quickValue(quick: Quick): string | null {
  const today = dayjs()
  if (quick === 'today') return today.format(FORMAT)
  if (quick === 'tomorrow') return today.add(1, 'day').format(FORMAT)
  if (quick === 'nextWeek') return today.add(1, 'week').format(FORMAT)
  return null
}

/**
 * Огнооны талбар: түгээмэл сонголт нэг хүрэлтээр (өнөөдөр, маргааш, 7
 * хоногийн дараа), бусад нь календарь хавтангаар. Хоосон байж болно.
 */
export function DateField({
  label,
  value,
  onChange,
  clearable = true,
}: {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  clearable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() =>
    value ? dayjs(value).toDate() : new Date(),
  )
  const text = messages.form.date

  const quicks: { value: Quick; label: string }[] = [
    { value: 'today', label: text.today },
    { value: 'tomorrow', label: text.tomorrow },
    { value: 'nextWeek', label: text.nextWeek },
    ...(clearable ? [{ value: 'none' as const, label: text.none }] : []),
  ]
  const activeQuick = quicks.find(
    (quick) => quickValue(quick.value) === value,
  )?.value

  return (
    <View className="gap-1.5">
      <AppText variant="label">{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => {
          setDraft(value ? dayjs(value).toDate() : new Date())
          setOpen(true)
        }}
        className="h-11 flex-row items-center gap-2 rounded-lg border border-input bg-card px-3"
      >
        <AppIcon name="leave" size={iconSize.sm} tone="muted" />
        <AppText
          variant="body"
          className={cn('flex-1', !value && 'text-muted-foreground')}
        >
          {value ? dayjs(value).format(FORMAT) : text.pick}
        </AppText>
        <AppIcon name="expand" size={iconSize.sm} tone="muted" />
      </Pressable>
      <FilterChips
        chips={quicks}
        value={activeQuick ?? ('' as Quick)}
        onChange={(quick) => onChange(quickValue(quick))}
      />

      <BottomSheet visible={open} title={label} onClose={() => setOpen(false)}>
        <ScrollView contentContainerClassName="items-center">
          <NativeDatePicker value={draft} onChange={setDraft} />
        </ScrollView>
        <AppButton
          label={messages.common.confirm}
          onPress={() => {
            onChange(dayjs(draft).format(FORMAT))
            setOpen(false)
          }}
        />
      </BottomSheet>
    </View>
  )
}
