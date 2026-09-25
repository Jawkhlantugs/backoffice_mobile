import { useRouter } from 'expo-router'

import { EMPTY_TASK } from '@/data/company-task/company-task-model'
import { useCreateTask } from '@/hooks/use-company-tasks'
import { messages } from '@/lib/messages'

import { TaskForm } from './task-form'

/** Үүсгэсний дараа шууд дэлгэрэнгүй рүү — checklist нэмэхэд бэлэн (вэбтэй ижил). */
export function NewTaskScreen() {
  const router = useRouter()
  const create = useCreateTask()

  return (
    <TaskForm
      title={messages.tasks.new}
      initial={EMPTY_TASK}
      submitLabel={messages.form.create}
      withStatus
      onSubmit={async (input, status) => {
        const task = await create.mutateAsync({ input, status })
        router.replace({
          pathname: '/office/tasks/[id]',
          params: { id: task.id },
        })
      }}
    />
  )
}
