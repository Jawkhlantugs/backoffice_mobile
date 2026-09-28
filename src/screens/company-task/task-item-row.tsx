import { Pressable, View } from 'react-native'

import { AppIcon, AppText } from '@/components'
import type { TaskItem } from '@/data/company-task/company-task-model'
import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { formatDateOnly } from '@/lib/date'
import { iconSize } from '@/theme/tokens'

/**
 * Checklist-ийн мөр — бүхэлд нь дарж тэмдэглэнэ (жижиг checkbox онох
 * шаардлагагүй). Удаан дарахад нэр солих/устгах.
 */
export function TaskItemRow({
  item,
  onToggle,
  onLongPress,
}: {
  item: TaskItem
  onToggle: () => void
  onLongPress: () => void
}) {
  const meta = [
    item.assignee?.email.split('@')[0],
    item.dueDate ? formatDateOnly(item.dueDate) : undefined,
    item.estimatedHours
      ? `${item.estimatedHours}${messages.units.hours}`
      : undefined,
  ].filter(Boolean)

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.isDone }}
      accessibilityHint={messages.tasks.itemActions}
      onPress={onToggle}
      onLongPress={onLongPress}
      className="min-h-11 flex-row items-center gap-3 py-2 active:opacity-60"
    >
      <AppIcon
        name={item.isDone ? 'checkboxChecked' : 'checkbox'}
        size={iconSize.md}
        tone={item.isDone ? 'default' : 'muted'}
      />
      <View className="flex-1 gap-0.5">
        <AppText
          variant="body"
          className={cn(item.isDone && 'text-muted-foreground line-through')}
        >
          {item.title}
        </AppText>
        {meta.length > 0 ? (
          <AppText variant="caption">{meta.join(' · ')}</AppText>
        ) : null}
      </View>
    </Pressable>
  )
}
