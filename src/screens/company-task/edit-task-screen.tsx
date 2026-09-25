import { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { toast } from '@/core/ui/toast-store'
import { EMPTY_TASK, taskToInput } from '@/data/company-task/company-task-model'
import { useCompanyTask, useUpdateTask } from '@/hooks/use-company-tasks'
import { messages } from '@/lib/messages'

import { TaskForm } from './task-form'

export function EditTaskScreen() {
  const router = useRouter()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const task = useCompanyTask(id)
  const update = useUpdateTask(task.data)
  const initial = useMemo(
    () => (task.data ? taskToInput(task.data) : EMPTY_TASK),
    [task.data],
  )

  return (
    <TaskForm
      title={messages.tasks.edit}
      initial={initial}
      submitLabel={messages.form.save}
      loading={task.isPending}
      error={task.error}
      onRetry={() => task.refetch()}
      onSubmit={async (input) => {
        await update.mutateAsync(input)
        toast.success(messages.form.saved)
        router.back()
      }}
    />
  )
}
