import { View } from 'react-native'
import dayjs from 'dayjs'

import {
  AppCard,
  AppIcon,
  AppText,
  ProgressBar,
  StatusPill,
} from '@/components'
import {
  isOverdue,
  taskProgress,
  type CompanyTask,
} from '@/data/company-task/company-task-model'
import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { PRIORITY_TONE, STATUS_TONE } from './task-tones'

const text = messages.tasks

/** Хариуцагчийг богино: эхний имэйлийн нэр + "+2". */
function assigneeLabel(task: CompanyTask): string | undefined {
  const [first, ...rest] = task.assignees
  if (!first) return undefined
  const name = first.email.split('@')[0]
  return rest.length > 0 ? `${name} +${rest.length}` : name
}

/**
 * Самбарын карт — нэг харцаар: гарчиг, төлөв, чухал зэрэг, явц, хугацаа,
 * хариуцагч. Удаан дарахад төлөв солих хавтан (дуудагч шийднэ).
 */
export function TaskCard({
  task,
  onPress,
  onLongPress,
}: {
  task: CompanyTask
  onPress: () => void
  onLongPress?: () => void
}) {
  const progress = taskProgress(task.items)
  const overdue = isOverdue(task, dayjs().format('YYYY-MM-DD'))
  const assignee = assigneeLabel(task)

  return (
    <AppCard
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={task.title}
      className="gap-3"
    >
      <View className="flex-row items-start gap-3">
        <AppText
          variant="body"
          numberOfLines={2}
          className="flex-1 font-semibold"
        >
          {task.title}
        </AppText>
        <StatusPill
          label={text.statuses[task.status]}
          tone={STATUS_TONE[task.status]}
        />
      </View>

      {progress.total > 0 ? (
        <View className="flex-row items-center gap-2">
          <ProgressBar percent={progress.percent} className="flex-1" />
          <AppText variant="tiny" numeric>
            {`${progress.done}/${progress.total}`}
          </AppText>
        </View>
      ) : null}

      <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
        <StatusPill
          label={text.priorities[task.priority]}
          tone={PRIORITY_TONE[task.priority]}
        />
        {task.dueDate ? (
          <View className="flex-row items-center gap-1">
            <AppIcon name="clock" size={iconSize.xs} tone="muted" />
            <AppText
              variant="caption"
              className={cn(overdue && 'text-destructive')}
            >
              {overdue ? `${text.overdue} · ` : ''}
              {dayjs(task.dueDate).format('MM/DD')}
            </AppText>
          </View>
        ) : null}
        {assignee ? (
          <View className="flex-row items-center gap-1">
            <AppIcon name="users" size={iconSize.xs} tone="muted" />
            <AppText variant="caption" numberOfLines={1}>
              {assignee}
            </AppText>
          </View>
        ) : null}
        {task.comments.length > 0 ? (
          <View className="flex-row items-center gap-1">
            <AppIcon name="comment" size={iconSize.xs} tone="muted" />
            <AppText variant="caption" numeric>
              {task.comments.length}
            </AppText>
          </View>
        ) : null}
      </View>
    </AppCard>
  )
}
