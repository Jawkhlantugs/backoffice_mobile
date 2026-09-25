import { useMemo, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'

import {
  AppButton,
  AppIcon,
  AppText,
  BottomSheet,
  StateView,
} from '@/components'
import type { CompanyTask } from '@/data/company-task/company-task-model'
import { useCompanyTasks } from '@/hooks/use-company-tasks'
import { cn } from '@/lib/cn'
import { formatDateOnly } from '@/lib/date'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

const text = messages.weeklyReports.taskPicker

/**
 * Вэбийн `TaskPickerDialog`: өөрийн (`scope: mine`) дууссан ба хийгдэж буй
 * даалгавраас, жагсаалтад аль хэдийн байгаа гарчгийг хасаад сонгуулна.
 */
export function TaskPickerSheet({
  visible,
  existing,
  onSelect,
  onClose,
}: {
  visible: boolean
  existing: string[]
  onSelect: (titles: string[]) => void
  onClose: () => void
}) {
  const query = useCompanyTasks('mine')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const tasks = useMemo(() => {
    const taken = new Set(existing.map((item) => item.trim().toLowerCase()))
    return (query.data ?? []).filter(
      (task) =>
        (task.status === 'COMPLETED' || task.status === 'IN_PROGRESS') &&
        !taken.has(task.title.trim().toLowerCase()),
    )
  }, [query.data, existing])

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const close = () => {
    setSelected(new Set())
    onClose()
  }

  const section = (status: CompanyTask['status']) => {
    const items = tasks.filter((task) => task.status === status)
    if (items.length === 0) return null
    return (
      <View key={status} className="gap-2">
        <AppText variant="tiny" className="uppercase tracking-wider">
          {`${messages.tasks.statuses[status]} (${items.length})`}
        </AppText>
        {items.map((task) => {
          const checked = selected.has(task.id)
          return (
            <Pressable
              key={task.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              onPress={() => toggle(task.id)}
              className={cn(
                'flex-row items-start gap-3 rounded-lg border p-3',
                checked ? 'border-primary bg-accent' : 'border-border',
              )}
            >
              <AppIcon
                name={checked ? 'checkboxChecked' : 'checkbox'}
                size={iconSize.md}
                tone={checked ? 'default' : 'muted'}
              />
              <View className="flex-1 gap-0.5">
                <AppText variant="body" className="font-medium">
                  {task.title}
                </AppText>
                <AppText variant="caption">
                  {[
                    messages.tasks.priorities[task.priority],
                    task.dueDate ? formatDateOnly(task.dueDate) : undefined,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </AppText>
              </View>
            </Pressable>
          )
        })}
      </View>
    )
  }

  return (
    <BottomSheet visible={visible} title={text.title} onClose={close}>
      <StateView
        loading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
        isEmpty={tasks.length === 0}
        emptyIcon="checklist"
        emptyLabel={text.empty}
      >
        <ScrollView className="shrink" contentContainerClassName="gap-4">
          {section('COMPLETED')}
          {section('IN_PROGRESS')}
        </ScrollView>
      </StateView>
      <AppButton
        label={`${text.add} (${selected.size})`}
        icon="check"
        disabled={selected.size === 0}
        onPress={() => {
          onSelect(
            tasks
              .filter((task) => selected.has(task.id))
              .map((task) => task.title),
          )
          close()
        }}
      />
    </BottomSheet>
  )
}
