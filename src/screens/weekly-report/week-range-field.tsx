import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import dayjs from 'dayjs'

import {
  AppButton,
  AppIcon,
  AppText,
  BottomSheet,
  FilterChips,
} from '@/components'
import { NativeDatePicker } from '@/components/native-date-picker'
import { currentWeek, weekOf } from '@/data/weekly-report/weekly-report-model'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

const text = messages.weeklyReports.fields
const DISPLAY = 'YYYY.MM.DD'

type Quick = 'this' | 'last'

/**
 * Вэбийн "Week Range" — нэг муж. Утсан дээр хоёр огноо тусад нь сонгуулахгүй:
 * өдөр сонгоход тухайн Даваа–Ням автоматаар.
 */
export function WeekRangeField({
  weekStart,
  weekEnd,
  onChange,
}: {
  weekStart: string
  weekEnd: string
  onChange: (range: { weekStart: string; weekEnd: string }) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(() => dayjs(weekStart).toDate())

  const thisWeek = currentWeek()
  const lastWeek = currentWeek(dayjs().subtract(1, 'week'))
  const active: Quick | '' =
    weekStart === thisWeek.weekStart
      ? 'this'
      : weekStart === lastWeek.weekStart
        ? 'last'
        : ''

  return (
    <View className="gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={text.week}
        onPress={() => {
          setDraft(dayjs(weekStart).toDate())
          setOpen(true)
        }}
        className="h-11 flex-row items-center gap-2 rounded-lg border border-input bg-card px-3"
      >
        <AppIcon name="leave" size={iconSize.sm} tone="muted" />
        <AppText variant="body" numeric className="flex-1">
          {`${dayjs(weekStart).format(DISPLAY)} – ${dayjs(weekEnd).format(DISPLAY)}`}
        </AppText>
        <AppIcon name="expand" size={iconSize.sm} tone="muted" />
      </Pressable>
      <FilterChips
        chips={[
          { value: 'this' as const, label: text.thisWeek },
          { value: 'last' as const, label: text.lastWeek },
        ]}
        value={active as Quick}
        onChange={(quick) => onChange(quick === 'this' ? thisWeek : lastWeek)}
      />

      <BottomSheet
        visible={open}
        title={text.pickWeek}
        onClose={() => setOpen(false)}
      >
        <ScrollView contentContainerClassName="items-center">
          <NativeDatePicker value={draft} onChange={setDraft} />
        </ScrollView>
        <AppButton
          label={messages.common.confirm}
          onPress={() => {
            onChange(weekOf(dayjs(draft).format('YYYY-MM-DD')))
            setOpen(false)
          }}
        />
      </BottomSheet>
    </View>
  )
}
