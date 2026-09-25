import { useState } from 'react'

import {
  AppInput,
  ChoiceField,
  DateField,
  FormScreen,
  FormSection,
  MultiSelectField,
  SelectField,
} from '@/components'
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskInput,
  type TaskStatus,
} from '@/data/company-task/company-task-model'
import { useTaskAssignees } from '@/hooks/use-company-tasks'
import { messages } from '@/lib/messages'

const text = messages.tasks
const f = text.fields

/**
 * Ажил нэмэх/засах нэг форм (вэбийн `company-task-form.tsx`-ийн дээд хэсэг).
 * Checklist, сэтгэгдэл нь дэлгэрэнгүй дэлгэцэд — үүсгэсний дараа тийш орно.
 */
export function TaskForm({
  title,
  initial,
  submitLabel,
  onSubmit,
  withStatus = false,
  loading,
  error,
  onRetry,
}: {
  title: string
  initial: TaskInput
  submitLabel: string
  onSubmit: (input: TaskInput, status: TaskStatus) => Promise<void>
  /** Шинэ ажилд л — засахад төлвийг дэлгэрэнгүйгээс солино. */
  withStatus?: boolean
  loading?: boolean
  error?: unknown
  onRetry?: () => void
}) {
  const [input, setInput] = useState(initial)
  const [status, setStatus] = useState<TaskStatus>('PLANNED')
  const [titleError, setTitleError] = useState<string>()
  const assignees = useTaskAssignees()

  // Засах үед өгөгдөл ачаалж дуусахад формыг түүгээр дүүргэнэ.
  const [source, setSource] = useState(initial)
  if (initial !== source) {
    setSource(initial)
    setInput(initial)
  }

  const set = <K extends keyof TaskInput>(key: K, value: TaskInput[K]) =>
    setInput((current) => ({ ...current, [key]: value }))

  async function submit() {
    if (!input.title.trim()) {
      setTitleError(text.required)
      return
    }
    setTitleError(undefined)
    await onSubmit(input, status)
  }

  return (
    <FormScreen
      title={title}
      submitLabel={submitLabel}
      onSubmit={submit}
      loading={loading}
      error={error}
      onRetry={onRetry}
    >
      <FormSection title={text.subtitle}>
        <AppInput
          label={`${f.title} *`}
          placeholder={f.titlePlaceholder}
          value={input.title}
          onChangeText={(value) => set('title', value)}
          error={titleError}
          autoFocus={!initial.title}
        />
        <AppInput
          label={f.description}
          placeholder={f.descriptionPlaceholder}
          value={input.description}
          onChangeText={(value) => set('description', value)}
          multiline
        />
      </FormSection>

      <FormSection title={messages.form.settings}>
        <ChoiceField
          label={f.priority}
          options={TASK_PRIORITIES.map((value) => ({
            value,
            label: text.priorities[value],
          }))}
          value={input.priority}
          onChange={(value) => set('priority', value)}
        />
        {withStatus ? (
          <SelectField
            label={f.status}
            placeholder={f.status}
            options={TASK_STATUSES.map((value) => ({
              value,
              label: text.statuses[value],
            }))}
            value={status}
            onChange={setStatus}
          />
        ) : null}
        <MultiSelectField
          label={f.assignees}
          placeholder={f.assigneesPlaceholder}
          options={(assignees.data ?? []).map((person) => ({
            value: person.id,
            label: person.email,
            description: person.department,
          }))}
          values={input.assigneeIds}
          onChange={(value) => set('assigneeIds', value)}
          loading={assignees.isPending}
          error={assignees.error}
          onRetry={() => assignees.refetch()}
        />
        <DateField
          label={f.dueDate}
          value={input.dueDate}
          onChange={(value) => set('dueDate', value)}
        />
      </FormSection>
    </FormScreen>
  )
}
