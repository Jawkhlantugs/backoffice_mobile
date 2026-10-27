import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import dayjs from 'dayjs'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { AppButton } from './app-button'
import { AppIcon } from './app-icon'
import { AppText } from './app-text'
import { BackofficeBottomSheet } from './backoffice-bottom-sheet'
import { FilterChips } from './filter-chips'
import { NativeDatePicker } from './native-date-picker'

/** Утга нь API-тай ижил `YYYY-MM-DD` — цагийн бүс хөрвүүлэхгүй. */
const FORMAT = 'YYYY-MM-DD'

type Quick = 'yesterday' | 'today' | 'tomorrow' | 'nextWeek'

function quickValue(quick: Quick | 'none'): string | null {
  const today = dayjs()
  if (quick === 'yesterday') return today.subtract(1, 'day').format(FORMAT)
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
  quickPicks = ['today', 'tomorrow', 'nextWeek'],
  clearLabel,
}: {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  clearable?: boolean
  /** Түүх харах талбарт ирээдүйн сонголт утгагүй — `['today', 'yesterday']`. */
  quickPicks?: Quick[]
  /** Хоосон утгын утга талбараас хамаарна: "Хугацаагүй", "Одоогийн". */
  clearLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() =>
    value ? dayjs(value).toDate() : new Date(),
  )
  const text = messages.form.date

  const quicks: { value: Quick | 'none'; label: string }[] = [
    ...quickPicks.map((quick) => ({ value: quick, label: text[quick] })),
    ...(clearable
      ? [{ value: 'none' as const, label: clearLabel ?? text.none }]
      : []),
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
        value={activeQuick ?? ('' as Quick | 'none')}
        onChange={(quick) => onChange(quickValue(quick))}
      />

      <BackofficeBottomSheet
        visible={open}
        title={label}
        onClose={() => setOpen(false)}
      >
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
      </BackofficeBottomSheet>
    </View>
  )
}
